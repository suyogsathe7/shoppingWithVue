Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    
    <div class="product">

    <div class="product-image">
        <a :href='href'>
            <img :src= "image">
        </a>
      
    </div>

    <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if='inStock'> In Stock !</p> 
        <p v-else>Out of Stock!!</p>

        <p> Shipping : {{shipping}} </p>

        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div v-for="(variant, index) in variants" 
             :key="variant.variantID"
             class="color-box"
             :style="{backgroundColor : variant.variantColor}"
             @mouseover="updateProduct(index)"
        >
        </div>

        <button 
        v-on:click="addToCart" :disabled="!inStock"
        class="cart-button"> Add to Cart </button>
        

        <button 
        v-on:click="resetCart"
        :disabled="!inStock"
        class="cart-button"> Reset Cart </button>

    </div>
    
    <div class="reviews">
    <h2> <u>Reviews </u></h2>
    <p v-if="!review.length">There are no reviews yet</p>
    <ul>
        <li v-for="review in review">
        <p> Name : {{review.name}}</p>
        <p>Rating : {{review.rating}}</p>
        <p>Review : {{review.review}}</p>
        </li>
    </ul>
    </div>


    <product-review @review-submitted="addReview"></product-review>

</div>`,
    data() {
        return {
            brand: "Nike",
            product: 'Socks',
            href: 'www.amazon.com',
            selectedVariant: 0,
            details: ["80% Polyester", "20% Cotton", "Gender-Neutral"],
            variants: [{
                    variantID: "1",
                    variantColor: "green",
                    variantImage: './assets/socks_green.jpg',
                    variantQuantity: 10
                },
                {
                    variantID: "2",
                    variantColor: "blue",
                    variantImage: './assets/socks_blue.jpg',
                    variantQuantity: 0
                }
            ],
            review: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
        },
        resetCart() {
            this.$emit('reset-cart', this.variants[this.selectedVariant].variantID);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.review.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                console.log(this.premium);
                return "Free"
            } else {
                return '2.99$';
            }
        }

    }
});

Vue.component('product-review', {
    template: `

    

    <form  class="decor" @submit.prevent="onSubmit">
    <div class="form-left-decoration"></div>
    <div class="form-right-decoration"></div>
    <div class="circle"></div>
    <div class="form-inner">

    <p v-if="errors.length">
    <b>Please correct the error(s): </b>
    <ul>
        <li v-for="error in errors">
        {{error}}
        </li>
    </ul>
    </p>

      <h1>Contact us</h1>

      <p>
      <label for="name"> Name : </label>
      <input id="name" v-model="name">
      </p>
        
      <p>
      <label for="rating"> Rating : </label>
      <select id="rating" v-model.number="rating">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
      </p>

      <p>
      <label for="review"> Review : </label>
      <textarea id="review" v-model="review"></textarea> 
      </p>
      
      <p>
      <input type="submit" value="Submit">
    </p>

    

    </div>
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating && this.review) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.rating = null
                this.review = null
            } else {
                if (!this.name) this.errors.push("Name Required");
                if (!this.rating) this.errors.push("Rating Required");
                if (!this.review) this.errors.push("Review Required");
            }
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        cart: [],
        premium: true
    },
    methods: {
        updateCart(id) {
            return this.cart.push(id);
        },
        resetCart() {
            return this.cart = [];
        }
    }

});