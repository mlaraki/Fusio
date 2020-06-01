import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		news: [],
		news_created_at: null,
		favorites: [],
		favorites_set: false,
		favorites_dev: [],
		favorites_chill: [],
		favorites_dev_set: false,
		favorites_chill_set: false,
		mode: 'Dev',
		default_favorites_dev: [
			{ name: "youtube", url: "https://www.youtube.com" },
			{ name: "github", url: "https://www.github.com" },
			{ name: "gitlab", url: "https://www.gitlab.com/" },
			{ name: "slack", url: "https://slack.com/" },
			{ name: "twitter", url: "https://twitter.com" },
			{ name: "codingame", url: "https://www.codingame.com/" },
			{ type: "add" }
		],
		default_favorites_chill: [
			{ name: "youtube", url: "https://www.youtube.com" },
			{ name: "instagram", url: "https://www.instagram.com" },
			{ name: "netflix", url: "https://www.netflix.com/" },
			{ name: "amazon", url: "https://www.amazon.com" },
			{ name: "twitter", url: "https://twitter.com" },
			{ name: "facebook", url: "https://www.facebook.com/" },
			{ type: "add" }
		],
		mode_42 : false
	},
	getters: {
		getters_news: state => state.news,
		getters_news_created_at: state => state.news_created_at,
		getters_favorites: state => state.mode == 'Dev' ? state.favorites_dev : state.favorites_chill ,
		getters_favorites_set:  state => state.mode == 'Dev' ? state.favorites_dev_set : state.favorites_chill_set ,
		getters_default_favorites: state => state.mode == 'Dev' ? state.default_favorites_dev : state.default_favorites_chill ,
		getters_mode: state => state.mode,
		getters_mode_42: state => state.mode_42,
	},
	mutations: {
		initialiseStore(state) {
			// Check if the ID exists
			if (localStorage.getItem('__Fusio__')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('__Fusio__')))
				);
			}
		},
		updateNews(state, value) {
			let time = Date.now();
			state.news = value;
			state.news_created_at = time;
		},
		updateNewsCreatedAt(state) {
			let time = Date.now();
			state.news_created_at = time;
		},
		updateFavorites(state, value) {
			if(state.mode == 'Dev'){
				state.favorites_dev_set = true;
				state.favorites_dev = value;
			}else if(state.mode == 'Chill'){
				state.favorites_chill_set = true;
				state.favorites_chill = value;
			}
		},
		updateMode(state, value) {
			state.mode = value;
		},
		toggle42(state) {
			state.mode_42 = !state.mode_42;
		}
	},
	actions: {
		setNews(ctx, news) {
			if (ctx.state.news.length < news.length)
				ctx.commit("updateNews", news);
		},
		setNewsCreatedAt(ctx) {
			ctx.commit("updateNewsCreatedAt");
		},
		setFavorites(ctx, favorites) {
			ctx.commit("updateFavorites", favorites);
		},
		setMode(ctx, mode) {
			ctx.commit("updateMode", mode);
		},
		set42(ctx) {
			ctx.commit("toggle42");
		},
	}
})

store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('__Fusio__', JSON.stringify(state));
});

export default store;