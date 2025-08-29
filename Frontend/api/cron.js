module.exports = async (req, res) => {
  const targets = [
    "https://aivaluation-oo5i.onrender.com"
  ];

  // Keep backend warm without downloading content
  await Promise.allSettled(
    targets.map((u) => fetch(u, { method: "HEAD", cache: "no-store" }))
  );

  res.status(200).send("ok");
};
