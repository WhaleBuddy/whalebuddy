import { DiscordIntegration } from "~/app/_components/discord-integration";

export default function DiscordIntegrationPage() {
  return (
    <main className="container mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Configurar Discord
        </h1>
        <p className="mt-2 text-gray-600">
          Conecte seu servidor Discord para receber notificações automáticas
        </p>
      </div>

      <DiscordIntegration />

      <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900">
          📝 Como configurar:
        </h3>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-blue-800">
          <li>
            Certifique-se de que o bot WhaleBuddy está adicionado ao seu
            servidor Discord
          </li>
          <li>Selecione o canal onde deseja receber as notificações</li>
          <li>Clique em &quot;Registrar Canal&quot; para salvar</li>
          <li>
            Use &quot;Enviar Teste&quot; para verificar se está funcionando
          </li>
        </ol>
      </div>

      <div className="mt-6 rounded-lg border border-yellow-100 bg-yellow-50 p-6">
        <h3 className="font-semibold text-yellow-900">
          ⚠️ Requisitos:
        </h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-yellow-800">
          <li>O bot precisa ter permissão para enviar mensagens no canal</li>
          <li>O bot precisa ter permissão para visualizar o canal</li>
          <li>O canal deve ser um canal de texto</li>
        </ul>
      </div>
    </main>
  );
}
