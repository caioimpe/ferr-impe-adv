// server/plugins/database.ts
// Plugin Nitro de startup — valida a conexão com o banco de dados.
//
// Executado UMA vez quando o servidor Nitro inicializa.
// Em produção (Vercel), isso ocorre na primeira invocação após um cold start.
//
// OBJETIVO: detectar problemas de configuração antes da primeira request
// de um usuário real, logando mensagens claras nos logs da Vercel em vez de
// deixar a primeira request falhar silenciosamente com 500.

export default defineNitroPlugin(async () => {
  // Sem DATABASE_URL — usando storage local (desenvolvimento).
  // Nada a validar aqui; o Nitro fs não precisa de conexão.
  if (!process.env.DATABASE_URL) {
    console.info('[DB] DATABASE_URL não definida — usando storage local (Nitro fs).')
    return
  }

  // Com DATABASE_URL — valida a conexão Prisma/Postgres.
  try {
    const { prisma } = await import('../utils/prismaClient')
    // Consulta mínima: conta artigos sem trazer dados — só testa conectividade.
    await prisma.$queryRaw`SELECT 1`
    console.info('[DB] Conexão com Postgres estabelecida com sucesso.')
  } catch (err: unknown) {
    // Loga o erro completo nos logs do servidor (visível na Vercel → Logs)
    // sem expor detalhes em respostas HTTP.
    const code = err && typeof err === 'object' && 'code' in err
      ? (err as { code: string }).code
      : 'UNKNOWN'

    console.error(`[DB] FALHA na conexão com Postgres (${code}):`, err)

    // Dicas por código de erro para facilitar o diagnóstico nos logs
    if (code === 'P1001') {
      console.error('[DB] ↳ Verifique se DATABASE_URL está correta e se o banco Neon está ativo.')
    } else if (code === 'P2021' || code === 'P2022') {
      console.error('[DB] ↳ A tabela "Article" não existe. Rode: npx prisma migrate deploy')
    } else if (code === 'P1003') {
      console.error('[DB] ↳ O banco de dados não existe. Verifique o nome na connection string.')
    }

    // Não lança exceção — o servidor sobe mesmo assim; cada request
    // verá um erro 503 claro ao tentar acessar o banco.
  }
})
