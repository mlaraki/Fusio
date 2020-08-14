import Vue from 'vue'
import Vuex from 'vuex'
const axios = require("axios");

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		news: [],
		news_created_at: null,
		news_devto: [],
		news_devto_created_at: null,
		news_favorites: [],
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
		mode_42: false
	},
	getters: {
		getters_news: state => state.news,
		getters_news_created_at: state => state.news_created_at,
		getters_news_devto: state => state.news_devto,
		getters_news_devto_created_at: state => state.news_devto_created_at,
		getters_news_favorites: state => state.news_favorites,
		getters_favorites: state => state.mode == 'Dev' ? state.favorites_dev : state.favorites_chill,
		getters_favorites_set: state => state.mode == 'Dev' ? state.favorites_dev_set : state.favorites_chill_set,
		getters_default_favorites: state => state.mode == 'Dev' ? state.default_favorites_dev : state.default_favorites_chill,
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
		updateNews_Devto(state, value) {
			let time = Date.now();
			state.news_devto = value;
			state.news_devto_created_at = time;
		},
		updateNewsCreatedAt_Devto(state) {
			let time = Date.now();
			state.news_devto_created_at = time;
		},
		addNewsFavorite(state, article) {
			state.news_favorites.push(article);
		},
		removeNewsFavorite(state, article) {
			let index = state.news_favorites.findIndex(art => art.id == article.id);
			if (index !== -1)
				state.news_favorites.splice(index, 1);
		},
		updateFavorites(state, value) {
			if (state.mode == 'Dev') {
				state.favorites_dev_set = true;
				state.favorites_dev = value;
			} else if (state.mode == 'Chill') {
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
		async setNews_Devto(ctx) {
			let time_since_last_fetched = Date.now() - (ctx.state.news_devto_created_at || 0);
			//force fetch every hour
			if (ctx.state.news_devto_created_at === null || !ctx.state.news_devto || time_since_last_fetched > 3600000) {
				const { data } = await axios.get("https://dev.to/api/articles");
				ctx.commit("updateNewsCreatedAt_Devto");
				ctx.commit("updateNews_Devto", data.map(art => {
					let genericArt = {
						id: art.id,
						title: art.title,
						type: 'devto',
						image: art.cover_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbUFe4GEdCm0-iWyaGnUK-KoJ7p0AP5erKYg&usqp=CAU",
						tags: art.tags,
						link: art.url
					};
					return genericArt;
				}));
			}
		},
		setNewsCreatedAt_Devto(ctx) {
			ctx.commit("updateNewsCreatedAt_Devto");
		},
		toggleNewsFavorites(ctx, article) {
			ctx.commit(ctx.state.news_favorites.findIndex(art => art.id === article.id) !== -1 ? "removeNewsFavorite" : "addNewsFavorite", article);
		},
		addNewsFavorites(ctx, article) {
			ctx.commit("addNewsFavorite", article);
		},
		removeNewsFavorite(ctx, article) {
			ctx.commit("removeNewsFavorite", article);
		},
		getArticleType(article) {
			return article.uid !== undefined ? 'FCC' : 'devto';
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