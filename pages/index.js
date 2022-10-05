import { useEffect, useState } from "react";
import Head from "next/head";
import InfiniteScroll from "react-infinite-scroller";

const Home = () => {
  const [photo, setPhoto] = useState([]);
  const [query, setQuery] = useState('')

  const [timeOutRef, setTimeOutRef] = useState(null)

  useEffect(() => {
    getMorePost(0)
  }, []);


  function getMorePost(pageNumber) {
    fetch(
      `https://api.unsplash.com/collections/5022130/photos?client_id=cHzzaJY0gf0Ov0CZ0qR_II4g74CCNjsIVVYviiqrB8I&per_page=20&page=${pageNumber}`
    )
      .then((response) => {
        response.json().then((d) => {
          setPhoto((phot) => ([...phot, ...d]))
        });
      })
      .catch((error) => console.error(error));
  }


  //Debounce
  useEffect(() => {
    if (timeOutRef) clearTimeout(timeOutRef);
    const ref = setTimeout(() => {
      getSearchedImage(query)
    }, 300)
    setTimeOutRef(ref)
  }, [query])


  function getSearchedImage(query) {
    if (query.length <= 0) return getMorePost(0)
    setPhoto((photos) => photos.filter((photo) => {
      if (photo.description) {
        return photo.description.toLowerCase().includes(query.toLowerCase())
      } return false
    }))
  }
  return (
    <>
      <Head>
        <title>Unsplash</title>
        <meta name="description" content="Unplash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <input className="mb-10" onChange={(e) => setQuery(e.target.value)} placeholder="Start searching here..."></input>

      <div className="" id="infinite-scroll">
        <InfiniteScroll pageStart={0} loadMore={getMorePost} hasMore={true} loader={<div>Loading...</div>}>
          {photo.map(({ urls, key }) => (
            <img width="300px" height="300px" key={key} src={urls["regular"]} />
      ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Home;
