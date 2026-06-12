module.exports = {
    HOMEPAGE: 600,     
    CATEGORIES: 300,  
    FEATURED_PRODUCTS: 300,
    PRODUCT_DETAIL: 120,
    SEARCH: 60,
    BRAND_LIST: 300,
    USER_PROFILE: 60,


    keys: {
        homepage: () => 'homepage:data',
        categories: () => 'categories:all',
        categoriesActive: () => 'categories:active',
        brandList: () => 'brands:all',
        featuredProducts: () => 'products:featured',
        productDetail: (id) => `product:${id}`,
        productSlug: (slug) => `product:slug:${slug}`,
        searchResults: (query) => `search:${Buffer.from(query).toString('base64')}`,
        userProfile: (id) => `user:profile:${id}`,
        cartCount: (userId) => `cart:count:${userId}`,
    },
};
