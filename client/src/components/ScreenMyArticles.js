import React, { useState, useEffect}  from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import { Card,} from 'antd';
import Nav from './Nav'
import Icon, { PropertySafetyFilled } from '@ant-design/icons';
import {connect} from 'react-redux';
import { ReadOutlined, DeleteOutlined   } from '@ant-design/icons';

const { Meta } = Card;

function ScreenMyArticles(props) {

  const [wishList, setWishList] = useState([])

  useEffect(() => {
    
      const loadMovies = async () => {
       
        const responseWish = await fetch('/wishlist-articles');
          const jsonResponseWish = await responseWish.json();
          
          const wishListFromDB = jsonResponseWish.articles.map((article,i) => {
            return {title:article.title,image:article.image, content: article.content  }
          })
          //(11.2)
          setWishList(wishListFromDB)
          
         
     }
     loadMovies()
     // console.log("App is loaded"); 
    }, []);


  // Bonus, faire en sorte d'afficher "No articles" si il n'y a pas d'article
  var noArticles
  if(props.Articles == 0){
    noArticles = <div style={{marginTop:"30px"}}>No articles</div>
  }

  const handleClickDeleteArticle = async articleTitle => {
    props.deleteToWishList(articleTitle)
   //var article = props.deleteToWishList(article.title)
    const response = await fetch(`/wishlist-artilce/${articleTitle}`, {
    method: 'DELETE',
   });
}


  return (
    //(3.18) Mise en place de la mécanique qui permet de déclencher l’action delete au moment où l’utilisateur clique sur le picto poubelle.
    //(3.15) exploitation de la liste des articles précédemment récupérés du store afin de matérialiser visuellement les différents articles
    <div>
         
            <Nav/>

            <div className="Banner"/>

            <div className="Card">
                {noArticles}
             {props.Articles.map((article, i) => (
                    <div  style={{display:'flex',justifyContent:'center'}}>
                      <Card
                        style={{  
                          width: 300, 
                          margin:'15px', 
                          display:'flex',
                          flexDirection: 'column',
                          justifyContent:'space-between' }}
                        cover={
                        <img
                            alt="example"
                            src={article.urlToImage}
                        />
                        
                        }
                        
                        actions={[
                          <ReadOutlined />,
                          <DeleteOutlined onClick={() => handleClickDeleteArticle(article)}/>
                        ]}
                        >
                          
                        <Meta
                          title={article.title}
                          description={article.description}
                        />


                  
                      </Card>

                        
                    </div>

                        ))}
  
                  
                

             </div>
      
 

      </div>
  );
}
//(3.13) mise en place du composant conteneur qui va englober ScreenMyArticles
function mapStateToProps(state) {
  //(3.14) on cible l’état qui correspond à la wishlist et on lui associe la valeur Articles
  return { 
    Articles : state.wishlist
   }
 
  };

  //[2](3.16) fonction permettant d’envoyer des informations à Redux
  function mapDispatchToProps(dispatch) {
    return {
      //(3.17) Cette fonction recoit le nom de articleTitle afin de déclencher une action nommée deleteArticle qui enverra cette information à Redux
      deleteToWishList: function(articleTitle) {
        dispatch( {
          type: 'deleteArticle',
          title: articleTitle
        })
      }
    }
  }
  
 //(3.19) Modification de l’export, pour appliquer nos functions au composant conteneur
  export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
  )
  (ScreenMyArticles);
