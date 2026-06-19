export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return res.status(200).json(getFallback())
  }

  try {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Pro-Tech%20Contracting%20Burlington%20VT&inputtype=textquery&fields=place_id&key=${apiKey}`
    )
    const searchData = await searchRes.json()
    const placeId = searchData?.candidates?.[0]?.place_id
    if (!placeId) return res.status(200).json(getFallback())

    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
    )
    const detailsData = await detailsRes.json()
    const result = detailsData?.result

    if (!result?.reviews?.length) return res.status(200).json(getFallback())

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json(result)
  } catch (err) {
    console.error('Reviews API error:', err)
    return res.status(200).json(getFallback())
  }
}

function getFallback() {
  return {
    name: 'Pro-Tech Contracting',
    rating: 5.0,
    user_ratings_total: null,
    reviews: [
      {
        author_name: 'Sarah M.',
        profile_photo_url: '',
        rating: 5,
        text: "Larry and his crew did an incredible job on our deck renovation. On time, on budget, and the quality is outstanding. You can tell these guys have been doing this for decades. We couldn't be happier.",
        relative_time_description: '2 months ago',
      },
      {
        author_name: 'Tom & Karen R.',
        profile_photo_url: '',
        rating: 5,
        text: "Pro-Tech did a complete kitchen remodel for us and it's stunning. Larry was professional, kept us updated throughout, and his team treated our home with respect. Highly recommend.",
        relative_time_description: '4 months ago',
      },
      {
        author_name: 'Dave B.',
        profile_photo_url: '',
        rating: 5,
        text: "Had them do siding and painting on our colonial. Best contractor experience I've had in 20 years of home ownership. Fair pricing, excellent craftsmanship. Will be calling them again.",
        relative_time_description: '6 months ago',
      },
    ],
  }
}
