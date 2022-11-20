import { CloudinaryContext, Transformation, Image } from "cloudinary-react";
import { useEffect, useRef, useState } from 'react'; 

export const Concert = ({ concert_name, artist, publicId }) => {

 const ref = useRef(null);
 const [url, setURL] = useState("");
 const [copy, setCopy] = useState("Copy link");

 useEffect(() => {
   setURL(ref.current.element.current.src);
   return () => {};
 }, []);

 const handleCopyToClip = () => {
   navigator.clipboard
     .writeText(url)
     .then(() => setCopy("Copied!"))
     .catch((err) => console.log("error copying to clipboard", err));
 };

  return (
    <div>
      <CloudinaryContext cloudName="beswift">
        <Image publicId={publicId} alt="image" width={500} ref={ref}>
          <Transformation crop="fit" effect="blur:100" />
          <Transformation effect="brightness_hsb:-50" />
          <Transformation
            color="#FFFFFF"
            overlay={{
              background: "",
              fontFamily: "Neucha",
              fontSize: 150,
              fontWeight: "bold",
              text: concert_name,
              textAlign: "center",
            }}
            width="1300"
            crop="fit"
          />
          <Transformation flags="layer_apply" />
          <Transformation
            color="#FFFFFF"
            overlay={{
              fontFamily: "Dancing Script",
              fontSize: 100,
              fontWeight: "bold",
              text: `Artist: ${artist}`,
            }}
          />
          <Transformation
            flags="layer_apply"
            gravity="center"
            x="450"
            y="350"
          />
        </Image>
      </CloudinaryContext>

      {/* Shareable link below */}
      <div className="mt-10">
        <h5>Shareable link</h5>
        <input
          disabled
          value={url}
          className="w-full lg:w-2/5 h-10 border-[#B7B3B3] border rounded-sm p-2 mr-4"
        />
        <button
          className="bg-gray-600 py-2 px-6 rounded-[5px] text-white font-semibold"
          onClick={handleCopyToClip}
        >
          {copy}
        </button>
      </div>
    </div>
  );
};
