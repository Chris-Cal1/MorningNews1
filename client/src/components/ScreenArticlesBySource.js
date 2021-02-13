import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import '../App.css';
import { Card, Modal, Button,} from 'antd';
import Nav from './Nav'
import { ReadOutlined, LikeOutlined  } from '@ant-design/icons';

//[1](3.1) Import des modules nécessaires dans le fichier qui contient le composant ScreenArticlesBySource.
import {connect} from 'react-redux';



const { Meta } = Card;


function ScreenArticlesBySource(props) {
//(1.8) Cet état matérialise la liste des articles d’une source.
  const [articleList, setArticleList] = useState([]);

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
 


  useEffect(() => {
    //(1.9) instruction permettant d’interroger l’URL précédemment trouvée
    const loadMyNews = async () => {
      var rawResponse = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=29c72389097041eb95bfa58a3ef924eb`);
      var response = await rawResponse.json(); 
     console.log("ARTICLES", response)
    //(1.10) Mise en place de la mécanique permettant de mettre à jour l’état articleList avec les articles reçus via le webservice
      setArticleList(response.articles)
    }
   loadMyNews()
  }, []);

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

  var saveArticle = async article => {
    props.addToWishList(article)
    //console.log(article)

   const saveReq = await fetch('/wishlist-article', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${article.title}&content=${article.content}&desc=${article.description}&lang=${props.selectedLang}&img=${article.urlToImage}&token=${props.token}`
     }); 
    }
    



  //(3.4) Mise en place la mécanique qui permet de déclencher l’action au moment où l’utilisateur clique sur le picto like
  //(1.11)  Exploitation de l’état articleList pour mettre à jour le composant afin qu’il matérialise visuellement les différents articles
  let articleListMap = articleList.map((article,i) => {
    let isThere = props.Articles.find(e => e.title === article.title)
    let color = {
      color: 'grey',
    }

    if(isThere) {
      color = {
        color: 'blue'
      }
    }
      
    return (
    <div key={i} style={{display:'flex',justifyContent:'center'}}>

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
       
          <ReadOutlined onClick={ () => showModal(article.title, article.content)} />,
          <LikeOutlined style={color} onClick={ () => saveArticle(article) }/> 
        ]}
        >

        <Meta
          title={article.title}
          description={article.description}
        />

          <Modal 
          title={title} 
          visible={visible} 
          onOk={handleOk} 
          onCancel={handleCancel}>
          <p>{title}</p>
            
            </Modal>

      </Card>
      

    </div>
      

  )})

  
  
  return (
    <div>
         
            <Nav/>
       
            <div className="Banner"/>

            <div className="Card">
             
             {articleListMap}

           </div> 

         
      
      </div>
  );
}

//(3.2) Paramétrage du composant conteneur avec une fonction permettant d’envoyer des informations à Redux
  function mapDispatchToProps(dispatch) {
    //(3.3) définission d'un bloc de code nommé addToWishList. Cette fonction reçoit les informations de l’article (title, description, content) 
       //   afin de déclencher une action nommée addArticle qui enverra ces informations auprès de Redux.
    return {
      addToWishList: function(article) {
          dispatch( {type: 'addArticle',
                    articleLiked: article
                  })
      }
    }
   }

   

   function mapStateToProps(state) {
    return { 
      token : state.token,
      selectedLang: state.selectedLang,
      Articles: state.wishlist
     }
   
    };

//(3.5) Modification de l’export pour l’appliquer au composant conteneur
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  )
(ScreenArticlesBySource);