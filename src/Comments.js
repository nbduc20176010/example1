import React, { useEffect, useState } from "react";
import data from "./comments.json";
import moment from "moment/moment";

const Comments = () => {
    const [commentsList, setCommentsList] = useState(data);

    const sortComments = () => {
        //list of comments with no parent
        let original_comments = [];
        //list of reply comments
        let reply_comments = [];
        let timeSortComments = commentsList.sort(
            (a, b) => b.createdAt - a.createdAt
        );
        timeSortComments.map((item) =>
            item.replyingTo === undefined
                ? original_comments.push({ ...item, sublist: [] })
                : reply_comments.push(item)
        );
        if (reply_comments.length > 0) {
            findParent(reply_comments, original_comments);
        }
        for (let i = commentsList.length - 1; i > 0; i--) {
            if (original_comments[i].replyingTo !== undefined) {
                let index = original_comments.findIndex(
                    (item) => item.id === original_comments[i].replyingTo
                );
                original_comments[index].sublist.push(original_comments[i]);
                original_comments.splice(i, 1);
            }
        }
        setCommentsList(original_comments);
    };

    const findParent = (replyList, parentList) => {
        for (let i = 0; i < replyList.length; i++) {
            let index = parentList.findIndex(
                (item) => item.id === replyList[i].replyingTo
            );
            if (index !== -1) {
                parentList.splice(index + 1, 0, {
                    ...replyList[i],
                    sublist: [],
                });
                replyList.splice(i, 1);
            }
        }
        if (replyList.length > 0) {
            findParent(replyList, parentList);
        }
    };

    const commentPrint = (commentItem) => {
        if (commentItem.sublist !== undefined) {
            return (
                <div
                    key={commentItem.id}
                    style={{
                        margin: "15px",
                        border: "1px solid black",
                        padding: "5px",
                        lineHeight: "1px",
                    }}
                >
                    <p>{commentItem.username}</p>
                    <p>{moment(commentItem.createdAt).fromNow()}</p>
                    <p>{commentItem.content}</p>
                    {commentItem.sublist.map((subitem) =>
                        commentPrint(subitem)
                    )}
                </div>
            );
        } else {
            return (
                <div
                    key={commentItem.id}
                    style={{
                        margin: "5px",
                        border: "1px solid black",
                        padding: "5px",
                        lineHeight: "1px",
                    }}
                >
                    <p>{commentItem.username}</p>
                    <p>{moment(commentItem.createdAt).fromNow()}</p>
                    <p>{commentItem.content}</p>
                </div>
            );
        }
    };

    useEffect(() => {
        sortComments(commentsList);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <div>{commentsList.map((item) => commentPrint(item))}</div>;
};

export default Comments;
