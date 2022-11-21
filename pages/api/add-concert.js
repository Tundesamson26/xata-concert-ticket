import { getXataClient } from "../../src/xata";

const handler = async (req, res) => {
  try {
  const xata = await getXataClient();

  const { concert_name, artist } = req.body;

  await xata.db.concert.create({
    concert_name,
    artist,
  });
   res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
};

export default handler;
