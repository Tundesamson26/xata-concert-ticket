import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getXataClient } from "../src/xata";
import { CloudinaryContext, Transformation, Image } from "cloudinary-react";
import { Concert } from "../components/Concert";
import ticket from "../utils/ticket.json";


export default function Home(concert) {
  console.log(concert)
  // const router = useRouter();
  const [tab, setTab] = useState("ticket");
  const [imageId, setImageId] = useState(null);
  const [formData, setFormData] = useState({
    concert_name: "",
    artist: "",
    publicId: null,
    error: false,
  });
  const [showCard, setShowCard] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = () => {
    fetch("/api/add-concert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        concert_name,
        artist,
      }),
    }).then(() => {
        setFormData({
          concert_name: "",
          artist: "",
        });
      })
      .catch(() => alert("An error occured"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
    if (imageId) {
      setShowCard(true);
    } else {
      setFormData({ ...formData, error: true });
    }
  };

  return (
    <div className="p-10">
      <Head>
        <title>Concert Ticket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="text-3xl">Custom concert tickets</h1>
        
        <header className="flex border-b-2 mt-7 mb-7">
          <Link href="#">
            <a
              className={`text-base capitalize mr-8 pb-4 ${
                tab === "ticket"
                  ? "font-bold border-b-4 border-[#1D4ED8] text-[#1D4ED8]"
                  : "text-[#5A5A7D]"
              } `}
              onClick={() => setTab("harvest")}
            >
              Concert tickets
            </a>
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="lg:w-2/5">
          <CloudinaryContext cloudName="beswift">
            <section className="mb-6">
              <label className="block text-sm text-[#535353] mb-2">
                Select an image
              </label>
              
                <div className="flex items-center">
                  {ticket.map((img) => (
                    <div
                      key={img.id}
                      className={`mr-2 ${
                        img.id === imageId ? "border-[#1D4ED8] border-4" : ""
                      }`}
                      onClick={() => {
                        setImageId(img.id);
                        setFormData({
                          ...formData,
                          publicId: img.publicId,
                          error: false,
                        });
                        setShowCard(false);
                      }}
                    >
                      <Image publicId={img.publicId} alt="greencrop">
                        <Transformation crop="scale" width="80" height="80" />
                      </Image>
                    </div>
                  ))}
                </div>
             
              {formData.error && (
                <p className="text-sm text-red-500">Please select an image</p>
              )}
            </section>
          </CloudinaryContext>
          <div className="mb-6">
            <label className="block text-sm text-[#535353] mb-2">Concert Name</label>
            <textarea
              rows="4"
              required
              name="concert_name"
              value={formData.concert_name}
              onChange={handleChange}
              maxLength={140}
              className="w-full border-[#B7B3B3] border rounded-sm p-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-[#535353] mb-2">Artist</label>
            <input
              required
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full h-10 border-[#B7B3B3] border rounded-sm p-2"
            />
          </div>
          <button className="bg-[#1D4ED8] py-3 px-7 rounded-[5px] text-white font-semibold">
            Generate Ticket
          </button>
        </form>

        {showCard && (
          <div className="mt-10">
            <Concert
              concert={formData.concert_name}
              artist={formData.artist}
              publicId={formData.publicId}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const xata = await getXataClient();
  const concerts = await xata.db.concert.getAll();
  return {
    props: {
      concert: concerts.map(({ replace, ...concert }) => concert),
    },
  };
}