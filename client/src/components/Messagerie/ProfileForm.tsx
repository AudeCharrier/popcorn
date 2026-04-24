import type { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./ProfileForm.css";
/**
 * Props du composant :
 * - session = utilisateur connecté (obligatoire pour récupérer son id)
 * - onProfileCreated = fonction appelée après création du profil
 */
type ProfileFormProps = {
  session: Session;
  onProfileCreated: () => Promise<void>;
};

function ProfileForm({ session, onProfileCreated }: ProfileFormProps) {
  /**
   * username = valeur de l'input
   * saving = permet de désactiver le bouton pendant l'enregistrement
   * message = message d'erreur ou d'information affiché à l'utilisateur
   */
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Fonction appelée quand on soumet le formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1 - submit lancé");

    /**
     * Nettoyage du username :
     * - trim() enlève les espaces
     * - toLowerCase() met en minuscule
     */
    const cleanUsername = username.trim().toLowerCase();
    console.log("2 - username:", cleanUsername);

    // Si vide → message d'erreur
    if (!cleanUsername) {
      setMessage("Entre un username.");
      return;
    }

    setSaving(true); // bloque le bouton
    setMessage(""); // reset message

    try {
      console.log("3 - avant insert direct");

      /**
       * Insertion dans la table "profiles"
       * - id = même id que le user Supabase (clé étrangère)
       * - username = pseudo choisi
       */
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: session.user.id,
            username: cleanUsername,
          },
        ])
        .select();

      console.log("4 - insert data:", data);
      console.log("5 - insert error:", error);

      // Si erreur → on l'affiche
      if (error) {
        setMessage(error.message);
        return;
      }

      /**
       * Si succès :
       * - on vide l'input
       * - on prévient le parent (ChatBox)
       *   pour qu'il recharge le profil
       */
      setUsername("");
      await onProfileCreated();
    } catch (error) {
      console.error("6 - catch:", error);
      setMessage("Erreur inattendue.");
    } finally {
      console.log("7 - finally");
      setSaving(false); // réactive le bouton
    }
  };

  return (
    <div>
      <h2>Créer ton profil</h2>
      <p className="p-profile-form">
        Choisis ton username pour utiliser la messagerie.
      </p>

      {/* Formulaire de création du profil */}
      <form className="form-profile-form" onSubmit={handleSubmit}>
        <input
          className="input-profile-form"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ton username"
        />

        {/* Bouton désactivé pendant l'enregistrement */}
        <button className="button-profile-form" type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Valider"}
        </button>
      </form>

      {/* Message d'erreur ou info */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfileForm;
