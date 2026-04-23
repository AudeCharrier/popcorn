import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import "./Chat.css";

/**
 * Représente une conversation privée entre 2 utilisateurs.
 * user_1 et user_2 stockent les ids des deux participants.
 */
type Conversation = {
  id: number;
  user_1: string;
  user_2: string;
  created_at: string;
};

/**
 * Représente un message récupéré dans la table "messages".
 * conversation_id = la conversation à laquelle le message appartient
 * sender_id = l'utilisateur qui a envoyé le message
 * content = le texte du message
 */
type Message = {
  id: number;
  conversation_id: number;
  sender_id: string;
  content: string;
  created_at: string;
};

/**
 * Props du composant Chat :
 * - session = session de l'utilisateur connecté
 * - conversation = conversation actuellement ouverte
 */
type ChatProps = {
  session: Session;
  conversation: Conversation;
};

function Chat({ session, conversation }: ChatProps) {
  /**
   * messages = tous les messages de la conversation ouverte
   * newMessage = valeur actuelle de l'input texte
   */
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    /**
     * Récupère tous les messages déjà enregistrés
     * pour la conversation actuellement ouverte.
     */
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erreur fetch messages :", error.message);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    /**
     * Canal realtime Supabase :
     * on écoute en direct les nouveaux messages insérés en base.
     */
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const insertedMessage = payload.new as Message;

          /**
           * On ne garde que les messages de la conversation ouverte.
           * Si le message appartient à une autre conversation, on ignore.
           */
          if (insertedMessage.conversation_id !== conversation.id) return;

          /**
           * On ajoute le message au state seulement s'il n'existe pas déjà.
           * Ça évite les doublons entre l'insert local et le realtime.
           */
          setMessages((prev) => {
            const alreadyExists = prev.some(
              (msg) => msg.id === insertedMessage.id,
            );
            if (alreadyExists) return prev;
            return [...prev, insertedMessage];
          });
        },
      )
      .subscribe((status) => {
        console.log("Realtime status :", status);
      });

    /**
     * Nettoyage :
     * quand on change de conversation ou qu'on quitte le composant,
     * on ferme le canal realtime.
     */
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  /**
   * Fonction appelée quand on envoie un message.
   * Elle :
   * 1. empêche le rechargement de la page
   * 2. envoie le message dans la base
   * 3. ajoute le message localement à l'écran
   * 4. vide l'input
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // On enlève les espaces inutiles
    const content = newMessage.trim();

    // Si rien n'est écrit, on ne fait rien
    if (!content) return;

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversation.id,
          sender_id: session.user.id,
          content,
        },
      ])
      .select();

    if (error) {
      console.error("Erreur envoi message :", error.message);
      return;
    }

    /**
     * On ajoute aussi le message tout de suite dans le state local,
     * pour voir le message apparaître instantanément sans attendre
     * le retour du realtime.
     */
    if (data && data.length > 0) {
      const insertedMessage = data[0] as Message;

      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === insertedMessage.id);

        if (alreadyExists) return prev;

        return [...prev, insertedMessage];
      });
    }

    // On vide l'input après envoi
    setNewMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* En-tête de la conversation */}
      <div className="chat-header">
        <h2>Conversation</h2>
      </div>

      {/* Zone qui affiche tous les messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-empty">Aucun message pour le moment.</p>
        ) : (
          messages.map((message) => {
            /**
             * Sert à savoir si le message affiché
             * a été envoyé par moi ou par l'autre utilisateur.
             * Utile pour le style droite / gauche.
             */
            const isMine = message.sender_id === session.user.id;

            return (
              <div
                key={message.id}
                className={isMine ? "message-row mine" : "message-row other"}
              >
                <div
                  className={
                    isMine ? "message-bubble mine" : "message-bubble other"
                  }
                >
                  <p>{message.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formulaire d'envoi d'un nouveau message */}
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écris un message..."
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default Chat;
