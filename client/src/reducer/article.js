
//(3.6) création de la fonction reducer qui permet de réagir à l’action “addArticle” envoyée précédemment.
export default function(wishlist = [], action) {
//(3.7) Mise en place dans cette fonction d'une mécanique permettant d’ajouter l’article reçu dans un état du store
    if(action.type == 'addArticle') {
        var wishListCopy = [...wishlist];


        //Bonus: faire en sorte de ne pas mettre plusieurs fois les mêmes articles peut-importe le nombre de fois qu'on click sur le like
        var findArticles = false

        for(let i=0;i<wishListCopy.length;i++){
            if(wishListCopy[i].title == action.articleLiked.title){
                findArticles = true
               
            }
        }
       if(!findArticles){
        wishListCopy.push(action.articleLiked);
        }
     //(3.8) Renvoi au store de la nouvelle valeur de l’état.
        return wishListCopy
  
   // (3.20) Réception de l’action précédemment envoyée via le reducer
    } else if(action.type == 'deleteArticle') {
   
        var wishListCopy = [...wishlist];
        var position = null
    //(3.21) Mise en place d'une mécanique permettant de détecter l’article à supprimer
      for(let i=0;i<wishListCopy.length;i++){
          if(wishListCopy[i].title == action.title){
              position = i
             
          }
      }
      wishListCopy.splice(position,1);
  //(3.22) Renvoi au store de la nouvelle valeur de l’état.
      return wishListCopy;
    }
    else {
        return wishlist;
    }
}