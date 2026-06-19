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
    user_ratings_total: 7,
    reviews: [
      {
        author_name: 'Ronnie Del Pino',
        profile_photo_url: '',
        rating: 5,
        text: 'Reasonable pricing and excellent work! Very easy to communicate with. AND very flexible and responsive to change orders.',
        relative_time_description: '2 years ago',
      },
      {
        author_name: 'Robert Paulsen',
        profile_photo_url: '',
        rating: 5,
        text: 'Protech contracting was amazing to work with. They went above and beyond to help with unexpected repairs needed after significant water damage to my house. They walked me through the process, were honest, fair, responsive and did a great job.',
        relative_time_description: 'a year ago',
      },
      {
        author_name: 'Colin Foster',
        profile_photo_url: '',
        rating: 5,
        text: "I used Larry and his team to address a little mold issue in my bathroom — essentially removing and replacing some drywall. I couldn't have been happier with the process. Timely, affordable, and great communication! Would certainly hire again.",
        relative_time_description: '6 months ago',
      },
      {
        author_name: 'Margaret van Dyke',
        profile_photo_url: '',
        rating: 5,
        text: "I recently used Pro-Tech to replace a rotten support post on my carport. They were fast, responsive and did great work, replacing the old post and caulking with new, pressure-treated wood, and didn't go over the estimate they gave me.",
        relative_time_description: '7 months ago',
      },
      {
        author_name: 'Renee Lavalley',
        profile_photo_url: '',
        rating: 5,
        text: 'Larry went above & beyond to help me out, getting my projects accomplished in a quick & efficient manner! Carpenters, very fast and knowledgeable!! The only company that responded to my request! 🙂',
        relative_time_description: '9 months ago',
      },
    ],
  }
}
