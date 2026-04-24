import { supabase } from "../../lib/supabase";

function DebugSupabase() {
  const handleTest = async () => {
    console.log("=== DEBUG SUPABASE START ===");

    const sessionResult = await supabase.auth.getSession();
    console.log("getSession:", sessionResult);

    const userResult = await supabase.auth.getUser();
    console.log("getUser:", userResult);

    const selectResult = await supabase.from("profiles").select("*");
    console.log("select profiles:", selectResult);

    const insertResult = await supabase.from("profiles").insert([
      {
        id: sessionResult.data.session?.user.id,
        username: "debug_test_user",
      },
    ]);

    console.log("insert profiles:", insertResult);

    console.log("=== DEBUG SUPABASE END ===");
  };

  return (
    <button type="button" onClick={handleTest}>
      Test Supabase
    </button>
  );
}

export default DebugSupabase;
