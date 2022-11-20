import { getXataClient } from "../../src/xata";

const handler = async (req, res) => {
  const xata = await getXataClient();

  const { concert_name, artist } =
    req.body;

  await xata.db.customers.create({
    concert_name,
    artist,
  });

  res.end();
};

export default handler;
