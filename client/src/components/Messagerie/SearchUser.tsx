import type { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

import "./SearchUser.css";

/**
 * Type d'une conversation simple.
 * C'est la forme reçue depuis la table "conversations".
 */
type Conversation = {
  id: number;
  user_1: string;
  user_2: string;
  created_at: string;
};

/**
 * Props du composant :
 * - session = utilisateur connecté
 * - onSelectConversation = fonction appelée quand une conversation
 *   est trouvée ou créée, pour l'ouvrir dans le composant parent
 */
type Props = {
  session: Session;
  onSelectConversation: (c: Conversation) => void;
};

function SearchUser({ session, onSelectConversation }: Props) {
  /**
   * search = valeur tapée dans l'input
   * sert à rechercher un user par son username
   */
  const [search, setSearch] = useState("");

  /**
   * Cherche si une conversation existe déjà entre :
   * - moi (session.user.id)
   * - l'autre utilisateur (otherId)
   *
   * Si elle existe → on la retourne
   * Sinon → on la crée puis on la retourne
   */
  const getOrCreateConversation = async (otherId: string) => {
    const myId = session.user.id;

    /**
     * On cherche une conversation déjà existante
     * dans les 2 sens :
     * - moi = user_1, lui = user_2
     * - ou lui = user_1, moi = user_2
     */
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(user_1.eq.${myId},user_2.eq.${otherId}),and(user_1.eq.${otherId},user_2.eq.${myId})`,
      )
      .maybeSingle();

    // Si la conversation existe déjà, on la renvoie
    if (existing) return existing;

    /**
     * Sinon, on crée une nouvelle conversation entre les 2 utilisateurs
     */
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_1: myId, user_2: otherId }])
      .select()
      .single();

    if (error) {
      console.error("Erreur création conversation :", error.message);
      return null;
    }

    return data;
  };

  /**
   * Fonction déclenchée quand on clique sur "OK"
   * ou quand on veut lancer une recherche utilisateur.
   */
  const handleSearch = async () => {
    const username = search.trim().toLowerCase();

    // Si l'input est vide, on arrête
    if (!username) return;

    /**
     * On cherche un utilisateur dans la table "profiles"
     * grâce à son username
     */
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Erreur recherche user :", error.message);
      return;
    }

    // Si aucun utilisateur trouvé, on arrête
    if (!data) return;

    // Empêche l'utilisateur de se rechercher lui-même
    if (data.id === session.user.id) return;

    /**
     * On récupère ou on crée la conversation avec cet utilisateur
     */
    const convo = await getOrCreateConversation(data.id);

    if (convo) {
      /**
       * On envoie la conversation au composant parent
       * pour qu'elle devienne la conversation active
       */
      onSelectConversation(convo);

      // On vide l'input après succès
      setSearch("");
    }
  };

  return (
    <div className="search-user">
      {/* Champ de recherche utilisateur */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher user"
      />

      {/* Bouton pour lancer la recherche */}
      <button type="button" onClick={handleSearch}>
        OK
      </button>
    </div>
  );
}

export default SearchUser;
