import React, { Component, PropTypes } from 'react';
import request from 'superagent';
import Post from './Post.js';

class LiveBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsVisible: this.props.numToLoad
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate() {
    // load any new twitter or instagram embeds
    if (window.twttr) window.twttr.widgets.load();
    if (window.instgrm) window.instgrm.Embeds.process(); 
  }

  getPosts() {
    request
    .get(this.props.url)
    .end((err, res) => {
      if (err) {
        console.error(err); 
      }
      else {
        this.setState({ posts: res.body });
      }
      window.setTimeout(() => {
        this.getPosts();
      }, this.props.refreshInterval * 1000);
    }); 
  }

  loadMore() {
    this.setState({ 
      postsVisible: this.state.postsVisible + this.props.numToLoad
    });
  }

  render() {
    const posts = this.state.posts
    // hide unpublished posts
    .filter(post => {
      return post.published;
    })
    // we'll use the object's position in the initial array as the react `key`
    .map((post, index) => {
      post.index = index;
      return post;
    })
    // most recent first
    .sort((a, b) => {
      return a.time < b.time;
    })
    // show only the posts that should be visible now
    .slice(0, this.state.postsVisible)
    .map(post => {
      return <Post key={post.index} {...post} />
    });

    let loadMoreButton;
    if (this.state.posts.length > this.state.postsVisible) {
      loadMoreButton = (
        <button onClick={this.loadMore}>{this.props.loadMoreButtonText}</button>
      );
    }

    return (
      <section className={this.props.className}>
        {posts}
        {loadMoreButton}
      </section>
    );
  }
}

App.propTypes = {
  url: PropTypes.string.isRequired,
  numToLoad: PropTypes.number.isRequired,
  refreshInterval: PropTypes.number.isRequired,
  loadMoreButtonText: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

App.defaultProps = {
  url: 'https://google-sheets-test.s3.amazonaws.com/data/19loh8WQudFyClZORX_nNzDvI4iVewVy9v70zdog83Uc',
  numToLoad: 10,
  refreshInterval: 30,
  loadMoreButtonText: 'Load More',
  className: 'live-blog'
}

export default LiveBlog;
