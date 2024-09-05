const supabase = require("./connection");

const lerTarefas = async (user_id) => {
  let { data, error } = await supabase
    .from("tasks")
    .select("feita, descricao, inicio, fim")
    .eq("user_id", user_id);
  if (error) {
    console.log("Erro ao consultar tarefas: ", error);
  } else {
    console.log(data);
    return data;
  }
};

module.exports = lerTarefas;