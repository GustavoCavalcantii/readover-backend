import figlet from "figlet";

export function generateASCII(nomeAplicacao: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!nomeAplicacao || typeof nomeAplicacao !== "string") {
      reject("Nome da aplicação não é válido");
      return;
    }

    figlet(nomeAplicacao, (err, data) => {
      if (err) {
        reject("Erro ao gerar arte ASCII");
        return;
      }
      resolve(data as string); 
    });
  });
}