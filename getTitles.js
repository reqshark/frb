const request = require('request')

module.exports = getTitles

/**
 *
 * getTitles(input, callback)
 * pass full input query and get back an array of titles for URLs
 *
 * caveats: if the urls are working
 * also: callback will fire immediately when no urls found from input
 *
 */

function getTitles(str, fn){
  const urls = (str.match(/(www|http:|https:)+[^\s]+[\w]/g) || [])
  let l = urls.length, n = 0 /* we'll use n to count number of callbacks */
  const links = []
  if (!l)
    return fn(links)
  while(l--){
    let url = urls[l]
    request(url, (e,r,b)=> {
      if (!e && r.statusCode === 200){
        /* match the title from the url response */
        let title = b.match(/<title>(.*?)<\/title>/g)
        if (title)
          links.push({
            url,
            title: title[0]
              .replace(/<title>/, '')
              .replace(/<\/title>/, ''),
          })
      }
      /* fire cb if qty of callbacks equals qty of urls */
      if (++n === urls.length)
        fn(links)
    })
  }
}
