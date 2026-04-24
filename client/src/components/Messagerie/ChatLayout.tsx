import type { Session } from "@supabase/supabase-js";
import { useState } from "react";
import Chat from "./Chat";
import ConversationsList from "./ConversationList";
import SearchUser from "./SearchUser";

import "./ChatLayout.css";

/**
 * Type d'une conversation enrichie.
 * otherUsername = username de l'autre utilisateur (ajouté côté front)
 */
type Conversation = {
  id: number;
  user_1: string;
  user_2: string;
  created_at: string;
  otherUsername?: string;
};

/**
 * Props du composant :
 * - session = utilisateur connecté
 * - username = username du user actuel (affiché en haut à gauche)
 */
type ChatLayoutProps = {
  session: Session;
  username: string;
};
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
function ChatLayout({ session, username }: ChatLayoutProps) {
  /**
   * conversation = conversation actuellement sélectionnée
   * null = aucune conversation sélectionnée
   */
  const [conversation, setConversation] = useState<Conversation | null>(null);

  return (
    /**
     * Layout global type Messenger :
     * - gauche = sidebar (recherche + liste)
     * - droite = chat actif
     */
    <div className="messenger-layout">
      {/* === SIDEBAR (colonne gauche) === */}
      <div className="messenger-sidebar">
        {/* Header avec le username de l'utilisateur connecté */}
        <div className="messenger-sidebar-header">
          <h2>{capitalize(username)}</h2>
        </div>

        {/* 
          Liste des conversations existantes.
          Quand on clique sur une conversation :
          → setConversation est appelé
        */}
        <ConversationsList
          session={session}
          onSelectConversation={setConversation}
        />
        {/* 
          Composant pour rechercher un utilisateur par username.
          Quand un user est trouvé → crée/ouvre une conversation
          → setConversation est appelé
        */}
        <SearchUser session={session} onSelectConversation={setConversation} />
      </div>

      {/* === PARTIE DROITE (chat actif) === */}
      <div className="messenger-main">
        {conversation ? (
          /**
           * Si une conversation est sélectionnée :
           * on affiche le composant Chat
           */
          <Chat session={session} conversation={conversation} />
        ) : (
          /**
           * Sinon :
           * écran vide avec message
           */
          <div className="messenger-empty">
            <p>Sélectionne une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatLayout;
