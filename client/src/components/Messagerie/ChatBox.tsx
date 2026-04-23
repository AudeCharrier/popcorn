import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";

import ChatLayout from "./ChatLayout";
import ProfileForm from "./ProfileForm";
import "./ChatBox.css";

/**
 * Type d'un profil utilisateur.
 * Chaque profil est lié à un user Supabase Auth via son id.
 */
type Profile = {
  id: string;
  username: string;
  created_at: string;
};

function ChatBox() {
  /**
   * session = session Supabase de l'utilisateur connecté
   * profile = profil récupéré dans la table profiles
   * loading = permet d'afficher "Chargement..." tant que l'init n'est pas finie
   * isOpen = dit si le panneau de chat est ouvert ou fermé
   * hasNotification = affiche une pastille sur le bouton quand un nouveau message arrive
   */
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  /**
   * Récupère le profil utilisateur dans la table "profiles"
   * à partir de l'id du user connecté.
   *
   * useCallback permet de garder une référence stable à cette fonction,
   * utile pour l'utiliser proprement dans les useEffect.
   */
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur fetch profile :", error.message);
      return;
    }

    setProfile(data);
  }, []);

  useEffect(() => {
    /**
     * Initialise la messagerie au chargement du composant.
     *
     * Étapes :
     * 1. vérifier si une session existe déjà
     * 2. sinon, créer une session anonyme
     * 3. récupérer le profil correspondant
     */
    const initChat = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erreur getSession :", error.message);
          setLoading(false);
          return;
        }

        /**
         * Si une session existe déjà, on la stocke,
         * puis on va chercher le profil utilisateur.
         */
        if (data.session) {
          setSession(data.session);
          setLoading(false);
          await fetchProfile(data.session.user.id);
          return;
        }

        /**
         * Si aucune session n'existe, on crée une session anonyme.
         * Ça évite un vrai écran de login visible à l'utilisateur.
         */
        const { data: anonData, error: anonError } =
          await supabase.auth.signInAnonymously();

        if (anonError) {
          console.error("Erreur session anonyme :", anonError.message);
          setLoading(false);
          return;
        }

        if (!anonData.session) {
          console.error("Aucune session anonyme reçue");
          setLoading(false);
          return;
        }

        /**
         * On enregistre la session anonyme,
         * puis on essaie de récupérer le profil.
         * Si aucun profil n'existe encore, on affichera ProfileForm.
         */
        setSession(anonData.session);
        setLoading(false);
        await fetchProfile(anonData.session.user.id);
      } catch (error) {
        console.error("Erreur inattendue :", error);
        setLoading(false);
      }
    };

    initChat();
  }, [fetchProfile]);

  useEffect(() => {
    /**
     * Ce useEffect écoute tous les nouveaux messages en temps réel
     * pour afficher une notification sur le bouton de chat.
     *
     * IMPORTANT :
     * La notif est gérée ici dans ChatBox, et non dans Chat.tsx,
     * car ChatBox reste monté même quand le panneau est fermé.
     */
    if (!session) return;

    const userId = session.user.id;

    const channel = supabase
      .channel(`chat-notifications-${userId}`)
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

          /**
           * Si c'est moi qui envoie le message,
           * on ne déclenche pas de notification.
           */
          if (newMessage.sender_id === userId) return;

          /**
           * On récupère la conversation liée au message
           * pour vérifier si l'utilisateur connecté en fait partie.
           */
          const { data: conversation, error } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", newMessage.conversation_id)
            .maybeSingle();

          if (error || !conversation) return;

          const isParticipant =
            conversation.user_1 === userId || conversation.user_2 === userId;

          /**
           * Si le message ne concerne pas une conversation
           * où l'utilisateur connecté participe, on ignore.
           */
          if (!isParticipant) return;

          /**
           * Si le panneau est fermé,
           * on affiche une pastille rouge sur le bouton.
           */
          if (!isOpen) {
            setHasNotification(true);
          }
        },
      )
      .subscribe((status) => {
        console.log("Notification realtime status:", status);
      });

    /**
     * Nettoyage :
     * on supprime le channel realtime quand le composant se démonte
     * ou quand les dépendances changent.
     */
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, isOpen]);

  return (
    <>
      {/* Bouton flottant qui ouvre / ferme la messagerie */}
      <button
        type="button"
        className="chat-toggle"
        onClick={() => {
          setIsOpen((prev) => !prev);

          /**
           * Quand on ouvre le chat,
           * on retire la notification visuelle.
           */
          setHasNotification(false);
        }}
      >
        💬{/* Pastille rouge si un nouveau message est reçu */}
        {hasNotification && <span className="chat-badge"></span>}
      </button>

      {/* Le panneau de messagerie n'apparaît que si isOpen = true */}
      {isOpen && (
        <aside className="chat-panel-right">
          {loading ? (
            <p>Chargement...</p>
          ) : !session ? (
            <p>Impossible de démarrer la messagerie.</p>
          ) : !profile ? (
            /**
             * Si l'utilisateur a une session
             * mais n'a pas encore de profil,
             * on lui demande de créer son profil.
             */
            <ProfileForm
              session={session}
              onProfileCreated={async () => {
                await fetchProfile(session.user.id);
              }}
            />
          ) : (
            /**
             * Si tout est prêt (session + profil),
             * on affiche la vraie messagerie.
             */
            <ChatLayout session={session} username={profile.username} />
          )}
        </aside>
      )}
    </>
  );
}

export default ChatBox;
