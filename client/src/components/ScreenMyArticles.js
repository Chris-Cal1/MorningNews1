import React, { useState, useEffect}  from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import { Card, Modal} from 'antd';
import Nav from './Nav'
import Icon, { PropertySafetyFilled } from '@ant-design/icons';
import {connect} from 'react-redux';
import { ReadOutlined, DeleteOutlined   } from '@ant-design/icons';

const { Meta } = Card;

function ScreenMyArticles(props) {

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [langFiltre, setLangFiltre] = useState('')

  useEffect(() => {
    const findArticlesWishList = async () => {
      const dataWishlist = await fetch(`/wishlist-article?lang=${langFiltre}&token=${props.token}`)
      const body = await dataWishlist.json()

      props.saveArticles(body.articles)
    }

    findArticlesWishList()
  },[langFiltre])

    const handleClickDeleteArticle = async title => {
      props.deleteToWishList(title)

    const response = await fetch('/wishlist-artilce', {
     method: 'DELETE',
     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
     body: `title=${title}&token=${props.token}`
    });
 }

   var filtreLang = (lang) => {
     setLangFiltre(lang)
    }

   var showModal = (title, content) => {
     setVisible(true)
     setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
}

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
 }

  // Bonus, faire en sorte d'afficher "No articles" si il n'y a pas d'article
  var noArticles
  if(props.Articles == 0){
    noArticles = <div style={{marginTop:"30px"}}>No articles</div>
  }

  


  return (
    //(3.18) Mise en place de la mécanique qui permet de déclencher l’action delete au moment où l’utilisateur clique sur le picto poubelle.
    //(3.15) exploitation de la liste des articles précédemment récupérés du store afin de matérialiser visuellement les différents articles
    <div>
         
            <Nav/>

            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
              <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/fr.png' onClick={() => filtreLang('fr')} />
              <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/uk.png' onClick={() => filtreLang('en')} /> 
            </div>
             
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
                          <ReadOutlined onClick={() => showModal(article.title,article.content)}/>,
                          <DeleteOutlined onClick={() => handleClickDeleteArticle(article)}/>
                        ]}
                        >
                          
                        <Meta
                          title={article.title}
                          description={article.description}
                        />

                      </Card>
                      <Modal
                         title={title}
                         visible={visible}
                         onOk={handleOk}
                         onCancel={handleCancel}
                      >
                    <p>{title}</p>
                    </Modal>
                        
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
    Articles : state.wishlist, token: state.token
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
      },
      saveArticles: function(articles){
        dispatch({type: 'saveArticles',
          articles: articles
        })
    }
  }
}
 
 
  
 //(3.19) Modification de l’export, pour appliquer nos functions au composant conteneur
  export default connect(
  mapStateToProps,
  mapDispatchToProps,
  
  
  
  )
  (ScreenMyArticles);
