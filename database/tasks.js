const supabase = require("./connection");

const lerTarefas = async (user_id) => {
  let consulta = await supabase
    .from("tasks")
    .select("feita, descricao, inicio, fim")
    .eq("user_id", user_id);
  if (consulta.error) {
    console.log("Erro ao consultar tarefas: ", consulta.error);
  } else {
    console.log(consulta.data);
  }
  return consulta;
};

module.exports = lerTarefas;
