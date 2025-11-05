import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import { IconButton, InputBase } from '@material-ui/core';
import { IoSearchOutline } from 'react-icons/io5';
import { addSearchTerm } from '../actions/filterActions';
import { useFilterProducts } from '../hooks/api/useProduct';
import LottieLoading from './LottieLoading';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    transition: 'background .3s',
    marginLeft: 0,
    marginBottom: 28,
    marginTop: 18,
    border: '1px solid #DDDDDD',
    borderRadius: 4,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
    margin: (props) => props.role === 'searchDrawer' && '30px 24px',
  },
  searchIcon: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00000',
    zIndex: 2,
  },
  inputRoot: {
    color: theme.palette.text.primary,
    width: (props) => props.role === 'searchDrawer' && '100%',
  },
  inputInput: {
    padding: '12px 50px 12px 20px',
    transition: theme.transitions.create('width'),
    width: '100%',
    position: 'relative',
    '&::placeholder': {
      color: 'transparent', // Ẩn placeholder mặc định
    },
    '&:focus::placeholder': {
      color: 'transparent', // Ẩn placeholder khi focus
    },
  },
  productList: {
    marginTop: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    maxHeight: 200,
    overflowY: 'auto',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    objectFit: 'cover',
  },
  productName: {
    margin: 0,
    fontWeight: 'bold',
    flex: 1,
  },
  productPrice: {
    margin: 0,
    fontSize: '0.9em',
    color: '#555',
  },
  marqueeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  },
  marqueeText: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    color: '#A3A2A2',
    fontSize: '0.9em',
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  noProductsFound: {
    padding: 10,
    textAlign: 'center',
    color: '#555',
  },
}));

const SearchBox = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const history = useHistory();

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  
  const { data: productsResponse, isLoading: loading } = useFilterProducts(
    debouncedKeyword ? { keyword: debouncedKeyword, perPage: 15 } : undefined
  );
  const products = productsResponse?.data?.products || [];

  const [displayText, setDisplayText] = useState('');
  const fullText = "Type here to search for products ...";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(true);
  const [showMarquee, setShowMarquee] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAdding) {
        if (currentIndex < fullText.length) {
          setDisplayText((prevText) => prevText + fullText[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          setIsAdding(false);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText((prevText) => prevText.slice(0, -1));
          setCurrentIndex((prevIndex) => prevIndex - 1);
        } else {
          setIsAdding(true);
        }
      }
    }, 60);

    return () => clearInterval(intervalId);
  }, [currentIndex, isAdding, fullText]);

  const handleInputChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    setShowMarquee(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword) {
      dispatch(addSearchTerm(keyword));
      history.push("/shop");
      if (props.setOpenSearchDrawer) {
        props.setOpenSearchDrawer(false);
      }
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timerId);
  }, [keyword]);

  return (
    <div>
      <form className={classes.search} onSubmit={handleSubmit}>
        {/* Chỉ hiển thị marquee khi showMarquee là true */}
        {showMarquee && (
          <div className={classes.marqueeContainer}>
            <span className={classes.marqueeText}>{displayText}</span>
          </div>
        )}
        <InputBase
          autoFocus={props.role === 'searchDrawer'}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={keyword}
          onChange={handleInputChange}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton type="submit" className={classes.searchIcon}>
          <IoSearchOutline fontSize={20} />
        </IconButton>
      </form>

      {/* Hiển thị danh sách sản phẩm */}
      {debouncedKeyword && (
        <div className={classes.productList}>
          {loading ? (
            <LottieLoading />
          ) : products.length > 0 ? (
            products.slice(0, 15).map((product) => (
              <div
                key={product._id}
                className={classes.productItem}
                onClick={() => {
                  history.push(`/product?id=${product._id}`);
                  setKeyword('');
                  if (props.setOpenSearchDrawer) {
                    props.setOpenSearchDrawer(false);
                  }
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={classes.productImage}
                />
                <div>
                  <p className={classes.productName}>{product.name}</p>
                  <p className={classes.productPrice}>{product.price} USD</p>
                  <p className={classes.productPrice}>{product.sale} USD</p>
                </div>
              </div>
            ))
          ) : (
            <p className={classes.noProductsFound}>No products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;