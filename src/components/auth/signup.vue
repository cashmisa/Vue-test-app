<template>
  <div id="Signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">
        <div class="input"
             :class="{ invalid: $v.email.$error}">
          <label for="email">Mail</label>
          <input type="email" id="email"
                 @blur="$v.email.$touch()"
                 v-model="email">
          <!--$v gives access to validators we set up-->
          <!--$touch is a method  -->
          <!--<div>{{ $v }}</div>-->
          <div v-if="$v.email.$error">
            <!--if the email: false as it is not valid email, then show this-->
            <small v-if="!$v.email.email"
                   class="text-danger">Invalid email address
            </small>
            <small v-if="!$v.email.required"
                   class="text-danger">Email is required
            </small>
            <small v-if="!$v.email.unique"
                   class="text-danger">Email is taken
            </small>
          </div>
        </div>
        <div class="input"
             :class="{ invalid: $v.age.$error, warning : parseInt(age) > 100}">
          <label for="age">Your Age</label>
          <!--<input type="number" id="age" v-model="age" @blur="$v.age.$touch()">-->
          <VueNumeric id="age"
                      v-model.lazy="age"
                      @blur="$v.age.$touch"
                      :minus="false"
                      :precision="0"
                      placeholder="your age"></VueNumeric>
          <div v-if="$v.age.$error">
            <small v-if="!$v.age.minValue || !$v.age.numeric"
                   class="text-danger">Must be at least {{ $v.age.$params.minValue.min}}
            </small>
            <small v-if="!$v.age.required"
                   class="text-danger">Age is required
            </small>
          </div>
          <div v-else
               :class="{'text-warning' : parseInt(age) > 100 }"><small>Age seems suspicious...</small></small></div>
        </div>
        <div class="input"
             :class="{ invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input type="password" id="password"
                 v-model="password"
                 @blur="$v.password.$touch()">
          <div v-if="$v.password.$error">
            <small v-if="!$v.password.minLength"
                   class="text-danger">
              Must be at least {{ $v.password.$params.minLength.min }} characters
            </small>
            <small v-if="!$v.password.required"
                   class="text-danger">Password is required
            </small>
          </div>
        </div>
        <div class="input"
             :class="{ invalid: $v.confirmPassword.$error}">
          <label for="confirm-pw">Confirm Password</label>
          <input type="password" id="confirm-pw"
                 v-model="confirmPassword"
                 @blur="$v.confirmPassword.$touch()">
          <div v-if="$v.confirmPassword.$error">
            <small v-if="!$v.confirmPassword.sameAsPassword"
                   class="text-danger">Passwords must be identical
            </small>
          </div>
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select name="country" id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="china">China</option>
            <option value="singapore">Singapore</option>
            <option value="malaysia">Malaysia</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some hobbies</h3>
          <button type="button"
                  @click="onAddHobby">Add Hobby
          </button>
          <small v-if="!$v.hobbyInputs.required"
                 class="text-danger">
            Hobby is required
          </small>
          <small v-if="!$v.hobbyInputs.minLength"
                 class="text-danger">
            Must contain at least {{$v.hobbyInputs.$params.minLength.min}} hobby
          </small>
          <div class="hobby-list">
            <div class="input"
                 v-for="(hobby, index) in hobbyInputs"
                 :class="{ invalide: $v.hobbyInputs.$each[index].$error}"
                 :key="hobby.id">
              <!--$v.hobbyInputs.$each[index].$error to check any element-->
              <div class="input">
                <label for="hobby.id">Hobby #{{index}}</label>
                <input type="text"
                       @blur="$v.hobbyInputs.$each[index].value.$touch()"
                       :id="hobby.id" v-model="hobby.value">
                <button
                  @click.prevent="onDeleteHobby(hobby.id)">X
                </button>
                <div v-if="$v.hobbyInputs.$each[index].value.$error">
                  <small
                    v-if="!$v.hobbyInputs.$each[index].value.required"
                    class="text-danger">required
                  </small>
                  <small
                    v-if="!$v.hobbyInputs.$each[index].value.minLength"
                    class="text-danger">Must contain at least
                    {{ $v.hobbyInputs.$each[index].value.$params.minLength.min}}
                    characters
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="input inline"
             :class="{invalid: $v.terms.$invalid}">
          <!--$invalid is true upon page load, for terms and conditions is what we want-->
          <input type="checkbox" id="terms"
                 @change="$v.terms.$touch()"
                 v-model="terms">
          <label for="terms">Accept Terms of Use (not required for China)</label>
        </div>
        <hr>
        <Percentage @percentageValidated="validatePercentage"></Percentage>
        <hr>
        <div class="submit">
          <button type="submit"
                  :disabled="$v.$invalid || !percentageValidated">Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Percentage from '../fields/percentage.vue'
  import VueNumeric from 'vue-numeric'
  import {
    required,
    email,
    numeric,
    minValue,
    sameAs,
    minLength,
    requiredUnless
  } from 'vuelidate/lib/validators'

  export default {
    name: 'Signup',
    components: {Percentage, VueNumeric},
    data () {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false,
        percentageValidated: false,
      }
    },
    validations: {
      email: {
        //custom name : imported validator - required: required,
        required,
        email,
        unique: inputValue => {
          //return true or false to determine if (true)valid or (false)not valid
          //e.g. return false - always invalid
          if (inputValue === '') return true //this validator doesn't care about other criteria
          //here it is firebase specific (use query string and orderby)
          return axios
            .get('/users.json?orderBy="email"&equalTo="' + inputValue + '"')
            .then(res => {
              return Object.keys(res.data).length === 0
            })
            .catch(err => console.log(err))
        }
      },
      age: {
        required,
        numeric,
        minValue: minValue(18)
        // between: between(20, 30)
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        // sameAsPassword: sameAs('password')
        sameAsPassword: sameAs(vm => {
          return vm.password
          //if you want to check if its the password + b or something
        })
      },
      terms: {
        requiredUnless: requiredUnless(vm => {
          //return true: is not required
          //return false: is always required
          //unless the country is china, it is required
          return vm.country === 'china'
        })
      },
      hobbyInputs: {
        //applies to the array object
        required,
        minLength: minLength(2), //min number of elements
        $each: {
          // applies to each of the elements
          value: {
            required,
            minLength: minLength(5) //number of characters
          }
        }
      },

    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(h => h.value),
          terms: this.terms
        }
        console.log(formData)
        this.$store.dispatch('signup', formData)
      },
      validatePercentage (payload) {
        this.percentageValidated = payload
      }
    }
  }
</script>
<style scoped>
  .text-danger {
    color: red;
  }
  .text-warning{
    color: orange;
  }
  hr {
    color: lightcyan;
    border: 0.5px solid lightgray;
    margin: 20px;
  }

  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input.invalid label {
    color: red;
  }

  .input.invalid input {
    border: 1px solid red;
    background-color: #ffc9aa;
  }

  .input.warning input {
    border: 1px solid orange;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>
