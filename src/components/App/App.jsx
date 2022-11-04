import { Status } from "config.js/config";
import { useState, useEffect } from "react";
import { getPhoto } from "../../services/api";
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import css from '../App/App.module.css'

function App() {
  const [photos, setPhotos] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(1);
  const [modalPhoto, setModalPhoto] = useState('');
  const [status, setStatus] = useState(Status.INIT);

  useEffect(() => {
    if (searchName) {
      setStatus(Status.LOADING);
      fetchPhoto(searchName, page);
    }
    async function fetchPhoto() {
      try {
        const { hits } = await getPhoto(searchName, page);
        setStatus(Status.SUCCESS);
        setPhotos(prevPhotos => [...prevPhotos, ...hits]);
      } catch (error) {
        console.log('error')
      }
    };
  }, [searchName, page]);

  const handleSubmit = search => {
    setSearchName(search);
    setPhotos([]);
    setPage(1);
    setStatus(Status.INIT);
  };

  const handleClickMore = () => { 
    setPage(prevPage => prevPage +1)
  };

  const toggleModal = (data) => {
    setModalPhoto(data);
    };
  
  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) setModalPhoto(''); 
  };

  const handleKeyDown = event => {  
    if (event.key === 'Escape')setModalPhoto('');  
  };
    
    return (
      <div className={css.App}>
        <Searchbar onSubmit={handleSubmit} />
        {status === Status.LOADING && <Loader />}
        <ImageGallery items={photos} onClickPicture={toggleModal} />
        {status === Status.SUCCESS && <Button onLoadMore={handleClickMore} />}
        {modalPhoto && (
            <Modal
              modalPhoto={modalPhoto}
              handleModalClose={handleBackdropClick}
              handleKeyDown={handleKeyDown}
            />)}
    </div>
  );
  }

export default App;
