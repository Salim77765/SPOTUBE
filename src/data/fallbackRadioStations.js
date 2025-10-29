// Fallback radio stations data for offline use
// These stations are used when the Radio Browser API is unavailable

const fallbackRadioStations = {
  'Bollywood Hits': [
    {
      stationuuid: 'fallback-bollywood-1',
      name: 'Bollywood Masala',
      url_resolved: 'https://stream.zeno.fm/fgrm4qzmzk8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/m8afyszryaqt.png',
      tags: 'bollywood,hindi,indian',
      language: 'Hindi',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-bollywood-2',
      name: 'Bollywood Evergreen',
      url_resolved: 'https://stream.zeno.fm/60ef4p33vxquv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/uvclzr9bqbfz.jpg',
      tags: 'bollywood,hindi,classics',
      language: 'Hindi',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-bollywood-3',
      name: 'Bollywood Remix',
      url_resolved: 'https://stream.zeno.fm/0r0xa792kwzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/m8afyszryaqt.png',
      tags: 'bollywood,hindi,remix',
      language: 'Hindi',
      bitrate: 128
    }
  ],
  'Punjabi Radio': [
    {
      stationuuid: 'fallback-punjabi-1',
      name: 'Punjabi Beats',
      url_resolved: 'https://stream.zeno.fm/eyxg23ky4x8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/2bazwnwrpdnc.jpg',
      tags: 'punjabi,bhangra,indian',
      language: 'Punjabi',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-punjabi-2',
      name: 'Punjabi Tadka',
      url_resolved: 'https://stream.zeno.fm/whz78qm9bm8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/2bazwnwrpdnc.jpg',
      tags: 'punjabi,bhangra,pop',
      language: 'Punjabi',
      bitrate: 128
    }
  ],
  'Tamil Radio': [
    {
      stationuuid: 'fallback-tamil-1',
      name: 'Tamil Beats',
      url_resolved: 'https://stream.zeno.fm/a2fmzk2wzv8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/ufce9hgzaqzz.png',
      tags: 'tamil,indian,kollywood',
      language: 'Tamil',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-tamil-2',
      name: 'Tamil Classics',
      url_resolved: 'https://stream.zeno.fm/60ef4p33vxquv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/ufce9hgzaqzz.png',
      tags: 'tamil,classics,oldies',
      language: 'Tamil',
      bitrate: 128
    }
  ],
  'Telugu Radio': [
    {
      stationuuid: 'fallback-telugu-1',
      name: 'Telugu Hits',
      url_resolved: 'https://stream.zeno.fm/eyxg23ky4x8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/ufce9hgzaqzz.png',
      tags: 'telugu,tollywood,indian',
      language: 'Telugu',
      bitrate: 128
    }
  ],
  'Malayalam Radio': [
    {
      stationuuid: 'fallback-malayalam-1',
      name: 'Malayalam Hits',
      url_resolved: 'https://stream.zeno.fm/whz78qm9bm8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/ufce9hgzaqzz.png',
      tags: 'malayalam,mollywood,indian',
      language: 'Malayalam',
      bitrate: 128
    }
  ],
  'Classical Indian': [
    {
      stationuuid: 'fallback-classical-1',
      name: 'Carnatic Radio',
      url_resolved: 'https://stream.zeno.fm/a2fmzk2wzv8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/ufce9hgzaqzz.png',
      tags: 'carnatic,classical,indian',
      language: 'Various',
      bitrate: 128
    }
  ],
  'Top 40 Hits': [
    {
      stationuuid: 'fallback-top40-1',
      name: 'Top 40 Radio',
      url_resolved: 'https://stream.zeno.fm/0r0xa792kwzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'pop,top40,hits',
      language: 'English',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-top40-2',
      name: 'Hit Music Station',
      url_resolved: 'https://stream.zeno.fm/rqtf0uy2kwzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'pop,top40,hits',
      language: 'English',
      bitrate: 128
    }
  ],
  'Hip Hop & R&B': [
    {
      stationuuid: 'fallback-hiphop-1',
      name: 'Hip Hop Classics',
      url_resolved: 'https://stream.zeno.fm/kkrgpbz9bm8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'hiphop,rap,rnb',
      language: 'English',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-hiphop-2',
      name: 'R&B Jams',
      url_resolved: 'https://stream.zeno.fm/whz78qm9bm8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'rnb,soul,hiphop',
      language: 'English',
      bitrate: 128
    }
  ],
  'Rock Radio': [
    {
      stationuuid: 'fallback-rock-1',
      name: 'Classic Rock',
      url_resolved: 'https://stream.zeno.fm/usefm93vwtzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'rock,classic,hits',
      language: 'English',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-rock-2',
      name: 'Rock Anthems',
      url_resolved: 'https://stream.zeno.fm/n8pz4k0cm0hvv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'rock,alternative,indie',
      language: 'English',
      bitrate: 128
    }
  ],
  'Electronic/Dance': [
    {
      stationuuid: 'fallback-electronic-1',
      name: 'EDM Hits',
      url_resolved: 'https://stream.zeno.fm/0r0xa792kwzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'electronic,dance,edm',
      language: 'English',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-electronic-2',
      name: 'House & Techno',
      url_resolved: 'https://stream.zeno.fm/n8pz4k0cm0hvv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'house,techno,electronic',
      language: 'English',
      bitrate: 128
    }
  ],
  'Jazz & Blues': [
    {
      stationuuid: 'fallback-jazz-1',
      name: 'Jazz Classics',
      url_resolved: 'https://stream.zeno.fm/usefm93vwtzuv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'jazz,blues,swing',
      language: 'English',
      bitrate: 128
    },
    {
      stationuuid: 'fallback-blues-1',
      name: 'Blues Channel',
      url_resolved: 'https://stream.zeno.fm/whz78qm9bm8uv',
      favicon: 'https://mytuner.global.ssl.fastly.net/media/tvos_radios/Hcfsgm3Suy.png',
      tags: 'blues,jazz,soul',
      language: 'English',
      bitrate: 128
    }
  ]
};

export default fallbackRadioStations;