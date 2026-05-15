exports.handler = async function(event, context) {
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
    if (!response.ok) throw new Error("TCMB yanıt vermedi: " + response.status);
    const xml = await response.text();
    const usdMatch = xml.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const eurMatch = xml.match(/CurrencyCode="EUR"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    if (!usdMatch || !eurMatch) throw new Error("Kur verisi XML'de bulunamadı");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ usd: parseFloat(usdMatch[1]), eur: parseFloat(eurMatch[1]), source: "TCMB", fetchedAt: new Date().toISOString() })
    };
  } catch (err) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};
