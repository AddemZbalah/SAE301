export default function renderImageGalerie({ images }) {
  const container = document.createElement("div");
  container.className = "";

  const mainImage = document.createElement("img");
  mainImage.src = `/assets/image/products/${images[0]}`;
  mainImage.className = "object-cover";
  container.appendChild(mainImage);

  const gallery = document.createElement("div");
  gallery.className = "flex gap-2 flex-col absolute top-40 space-x-2 mt-4";

  images.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = `/assets/image/products/${img}`;
    thumb.alt = `Miniature ${i + 1}`;
    thumb.className = "flex flex-col w-16 h-16 object-contain cursor-pointer border-1 border-b";

    thumb.onclick = () => {
      mainImage.src = `/assets/image/products/${img}`;
    };

    gallery.appendChild(thumb);
  });

  container.appendChild(gallery);
  return container;
}
