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
  onProfileReady: (profile: Profile) => Promise<void> | void;
};

type Profile = {
  id: string;
  username: string;
  created_at: string;
};

function ProfileForm({ session, onProfileReady }: ProfileFormProps) {
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
      const { data: existingProfile, error: searchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (searchError) {
        setMessage(searchError.message);
        return;
      }

      if (existingProfile) {
        setUsername("");
        await onProfileReady(existingProfile);
        return;
      }

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
      const createdProfile = data?.[0] as Profile | undefined;

      if (createdProfile) {
        await onProfileReady(createdProfile);
      }
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
      <h2>Ton profil</h2>
      <p className="p-profile-form">
        Choisis un username ou entre un username existant pour le reprendre.
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
