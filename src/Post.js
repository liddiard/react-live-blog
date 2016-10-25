import React, { Component } from 'react';
import moment from 'moment';
import Markdown from 'react-markdown';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getMediaType() {
    const media = this.props.media;
    if (typeof media !== 'string') {
      return;
    }
    if (/\.(jpg)|(png)|(gif)$/.test(media)) {
      return 'image';
    }
    else return 'embed';
  }

  // https://facebook.github.io/react/tips/dangerously-set-inner-html.html
  getEmbedCode() {
    return {
      __html: this.props.media
    };
  }

  render() {
    let author;
    if (this.props.author) {
      author = <author>by {this.props.author}</author>;
    }

    let media;
    const mediaType = this.getMediaType();
    if (mediaType === 'image') {
      media = <img src={this.props.media} alt={this.props.text} />;
    }
    else if (mediaType === 'embed') {
      media = <div className="embed" dangerouslySetInnerHTML={this.getEmbedCode()} />;
    }

    return (
      <article>
        <time dateTime={this.props.time}>
          {moment(this.props.time).fromNow()}
        </time>
        {media}
        <Markdown source={this.props.text} />
        {author}
      </article>
    );
  }
}

Post.propTypes = {
  author: React.PropTypes.string,
  text: React.PropTypes.string,
  media: React.PropTypes.string,
  time: React.PropTypes.string.isRequired,
  published: React.PropTypes.bool.isRequired
};

export default Post;
