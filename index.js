import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
  //console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const tweetInput = document.getElementById('tweet-input')
let feed = document.getElementById("feed")



//____________________ RENDER FEED ____________________


   
    function getFeedHtml(){
    
        let feedHtml = ``
        
        
        tweetsData.forEach(function(tweet){
            let likeIconClass = ""
            

            if(tweet.isLiked){
                likeIconClass = "liked"
            }

            let retweetIconClass = ""

            if(tweet.isRetweeted){
                retweetIconClass = "retweeted"
            }

            let repliesHtml = ''
            if(tweet.replies.length > 0){
                tweet.replies.forEach(function(reply){
                    repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                               
                        </div>
                        `
                      
                    
                })
            }
            repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="images/scrimbalogo.png" class="profile-pic">
                                        <textarea placeholder="comment" class="comment-input" data-commentinput="${tweet.uuid}"></textarea>
                            </div>
                                <button class="comment-btn" id="comment-btn" data-comment="${tweet.uuid}">Enter</button>
                        </div>
                        `

         

            feedHtml += `
                        <div class="tweet">
                            <div class="tweet-inner">
                                <img src="${tweet.profilePic}" class="profile-pic">
                                <div>
                                <section id="handle-options">
                                    <p class="handle">${tweet.handle}</p>
                                    
                                    <i class="fa-solid fa-trash" id="${tweet.handle}" data-delete="${tweet.tweetText}"></i>                                       
                                    </section>
                                    <p class="tweet-text">${tweet.tweetText}</p>
                                    <div class="tweet-details">
                                        <span class="tweet-detail">
                                            <i class="fa-regular fa-comment-dots hidden" data-reply="${tweet.uuid}"></i>
                                            ${tweet.replies.length}
                                        </span>
                                        <span class="tweet-detail">
                                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                            ${tweet.likes}
                                        </span>
                                        <span class="tweet-detail">
                                            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                            ${tweet.retweets}
                                        </span>
                                    </div>   
                                </div>            
                            </div>
                            <div class="hidden" id="replies-${tweet.uuid}">
                                ${repliesHtml}
                            </div>   
                            
                        </div>
                        `
       })
       return feedHtml 
    }
    
    function render(){
        document.getElementById("feed").innerHTML = getFeedHtml()
    }
    
    
    
    render()

//____________________ LIKE BUTTON ____________________

  
    document.addEventListener('click', function(e){
        if(e.target.dataset.like){
           handleLikeClick(e.target.dataset.like) 
        }
    })

    function handleLikeClick(tweetId){ 
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if (targetTweetObj.isLiked){
            targetTweetObj.likes--
        }
        else{
            targetTweetObj.likes++ 
        }
        targetTweetObj.isLiked = !targetTweetObj.isLiked
        render()
    }
        
//____________________ RETWEET BUTTON ____________________

    document.addEventListener('click', function(e){
        if(e.target.dataset.retweet){
           handleRetweetClick(e.target.dataset.retweet) 
        }
    })


    function handleRetweetClick(tweetId){ 
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if (targetTweetObj.isRetweeted){
            targetTweetObj.retweets--
        }
        else{
            targetTweetObj.retweets++ 
        }
        targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
        render()
    }

    
//____________________ REPLIES BUTTON ____________________

document.addEventListener('click', function(e){
    if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply) 
    }
})

function handleReplyClick(replyId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
    if(targetTweetObj.replies.length>=0){
        document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
    }
}

//____________________ TWEET BUTTON ____________________

addEventListener('click',function(e){
    if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleTweetBtnClick(){
    if(tweetInput.value){
    tweetsData.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    })
    render()
    tweetInput.value = ''
    }
}


//____________________ OPTIONS MODAL ____________________

document.addEventListener('click', function(e){
    if(e.target.id==="@Scrimba"){
       removeTweet(e.target.dataset.delete)
    }
})

function removeTweet(tweetText){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.tweetText === tweetText
    })[0]
    const index = tweetsData.indexOf(targetTweetObj);
    tweetsData.splice(index,1)
    render()
}

//____________________ COMMENT BUTTON ____________________

addEventListener('click',function(e){
    if(e.target.dataset.comment){
        handleCommentBtnClick(e.target.dataset.comment)
    }
})

function handleCommentBtnClick(commentId){
    let commentInput = document.querySelectorAll('[data-commentinput~=commentId]')
    if(commentInput.value){
        const targetTweetObj = tweetsData.filter(function(t){
            return t.uuid === commentId
        })[0]
        const index=tweetsData.indexOf(targetTweetObj);
        tweetsData[index].replies.unshift(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: commentInput.value,
            })
            
        
    /*tweetsData.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    })
    render()
    tweetInput.value = ''*/
    
    }
    
}






