import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import "./ConversationList.css";

/**
 * Type d'une conversation enrichie avec le username
 * de l'autre utilisateur.
 */
type Conversation = {
  id: number;
  user_1: string;
  user_2: string;
  created_at: string;
  otherUsername: string;
  hasNotification?: boolean; // 👈 NEW
};

/**
 * Props du composant :
 * - session = utilisateur actuellement connecté
 * - onSelectConversation = fonction appelée quand on clique sur une conversation
 */
type Props = {
  currentUserId: string;
  activeConversationId: number | null;
  notifiedConversationIds: number[];
  onSelectConversation: (c: Conversation) => void;
};

function ConversationsList({
  currentUserId,
  activeConversationId,
  notifiedConversationIds,
  onSelectConversation,
}: Props) {
  /**
   * conversations = tableau de toutes les conversations
   * de l'utilisateur connecté
   */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  /**
   * Petite fonction utilitaire :
   * met la première lettre d'un texte en majuscule
   * ex: "morgane" -> "Morgane"
   */
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    /**
     * Charge toutes les conversations de l'utilisateur connecté,
     * puis récupère le username de l'autre utilisateur
     * pour pouvoir l'afficher dans la liste.
     */
    const fetchConversations = async () => {
      /**
       * Étape 1 :
       * on récupère toutes les conversations où l'utilisateur connecté
       * apparaît soit dans user_1, soit dans user_2
       */
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_1.eq.${currentUserId},user_2.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur conversations :", error.message);
        return;
      }

      if (!data) return;

      /**
       * Étape 2 :
       * pour chaque conversation, on récupère l'id de "l'autre personne"
       * (celle avec qui on discute)
       *
       * Si je suis user_1 -> l'autre est user_2
       * Si je suis user_2 -> l'autre est user_1
       */
      const otherUserIds = data.map((conv) =>
        conv.user_1 === currentUserId ? conv.user_2 : conv.user_1,
      );

      /**
       * Étape 3 :
       * on va chercher dans la table "profiles"
       * les usernames correspondant à ces ids
       */
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", otherUserIds);

      /**
       * Étape 4 :
       * on fusionne les données :
       * - la conversation
       * - le username de l'autre utilisateur
       *
       * On ajoute une nouvelle propriété : otherUsername
       */
      const conversationsWithUsernames = data.map((conv) => {
        const otherId =
          conv.user_1 === currentUserId ? conv.user_2 : conv.user_1;

        const profile = profiles?.find((p) => p.id === otherId);

        return {
          ...conv,
          otherUsername: profile?.username || "Unknown",
        };
      });

      /**
       * Étape 5 :
       * on met le résultat final dans le state React
       * pour afficher la liste à l'écran
       */
      setConversations(
        conversationsWithUsernames.map((conv) => ({
          ...conv,
          hasNotification: notifiedConversationIds.includes(conv.id),
        })),
      );
    };

    fetchConversations();
  }, [notifiedConversationIds, currentUserId]);
  useEffect(() => {
    const channel = supabase
      .channel(`conversation-list-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: number;
            conversation_id: number;
            sender_id: string;
            content: string;
            created_at: string;
          };
          const conversationId = Number(newMessage.conversation_id);

          // Ignore mes propres messages
          if (newMessage.sender_id === currentUserId) return;

          // Ignore la conversation déjà ouverte
          if (conversationId === activeConversationId) return;

          const { data: conversation, error } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", conversationId)
            .maybeSingle();

          if (error || !conversation) return;

          const isParticipant =
            conversation.user_1 === currentUserId ||
            conversation.user_2 === currentUserId;

          if (!isParticipant) return;

          const otherId =
            conversation.user_1 === currentUserId
              ? conversation.user_2
              : conversation.user_1;

          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", otherId)
            .maybeSingle();

          setConversations((prev) => {
            const alreadyExists = prev.some(
              (conv) => conv.id === conversation.id,
            );
            if (alreadyExists) {
              return prev.map((conv) =>
                conv.id === conversation.id
                  ? { ...conv, hasNotification: true }
                  : conv,
              );
            }

            return [
              {
                ...conversation,
                otherUsername: profile?.username || "Unknown",
                hasNotification: true,
              },
              ...prev,
            ];
          });
        },
      )
      .subscribe((status) => {
        console.log("ConversationList realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, currentUserId]);
  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          className="conversation-item"
          onClick={() => {
            onSelectConversation(conversation);

            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === conversation.id
                  ? { ...conv, hasNotification: false }
                  : conv,
              ),
            );
          }}
        >
          {capitalize(conversation.otherUsername)}

          {/* 🔴 pastille */}
          {conversation.hasNotification && (
            <span className="conversation-badge"></span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ConversationsList;
