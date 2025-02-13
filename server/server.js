import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
})
import client from './db.js';
await client.connect();

fastify.get('/family', async (req, res) => {
  try {
    const response = await client.query(`
            WITH member_expenses AS (
                SELECT 
                    ep.fio,
                    SUM(ep.count * p.price) as total_expenses,
                    date_trunc('month', ep.date) as expense_month
                FROM expence_product ep
                JOIN product p ON ep.product = p.name 
                GROUP BY ep.fio, date_trunc('month', ep.date)
            )
            SELECT 
                fm.id,
                fm.fio,
                fm.date,
                fmj.position,
                fmj.organisation,
                fmj.salary,
                fmj.date as job_date,
                CASE 
                    WHEN COALESCE(fmj.salary, 0) > COALESCE(me.total_expenses, 0) THEN 'Профицит бюджета'
                    WHEN COALESCE(fmj.salary, 0) < COALESCE(me.total_expenses, 0) THEN 'Дефицит бюджета'
                    ELSE 'Дефицит бюджета'
                END as budget_status
            FROM family_members fm
            LEFT JOIN family_members_job fmj ON fm.fio = fmj.fio
            LEFT JOIN member_expenses me ON fm.fio = me.fio 
                AND date_trunc('month', CURRENT_DATE) = me.expense_month
        `)
    await res.send(response.rows)
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Ошибка при получении данных о членах семьи' });
  }
});

// Запуск сервера
try {
  console.log(`Сервер запущен на порту 3000`);
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}