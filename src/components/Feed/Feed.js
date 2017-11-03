import React, { Component } from 'react';
import Quote from '../Quote/Quote';

const Feed = ({ quotes, toggleStarred, editQuote, deleteQuote }) => {
    return (
        <div>
            {quotes &&
                Object.keys(quotes)
                    .reverse()
                    .map(index => (
                        <Quote
                            key={index}
                            quote={quotes[index]}
                            index={index}
                            editQuote={editQuote}
                            toggleStarred={toggleStarred}
							deleteQuote={deleteQuote}
                        />
                    ))}
        </div>
    );
};

export default Feed;
