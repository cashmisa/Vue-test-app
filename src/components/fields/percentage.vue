<template>
    <div class="input inline percentage">
        <div class="form-group">
            <table>
                <tr><th colspan="2"><h3>Remaining: <span :class="{'text-danger': getSum()!==100}">{{remaining}}%</span></h3></th></tr>
                <tr v-for="(amount, index) in amounts" :key="amounts[index].id">
                    <th>Amount {{index + 1}}</th>
                    <td>
                        <div class="input" :class="{ invalide: $v.amounts.$each[index].$error}">
                        <input class="form-control" type="number" v-model.lazy="amounts[index].value" 
                        @blur="validatePercentage(index)"/>
                        </div>
                        <div v-if="$v.amounts.$each[index].$error">
                        <small v-if="!$v.amounts.$each[index].value.required" class="text-danger">Required</small>
                        <small v-if="!$v.amounts.$each[index].value.between" class="text-danger">
                            Must be between {{$v.amounts.$each[index].value.$params.between.min}} 
                            and {{$v.amounts.$each[index].value.$params.between.max}}</small>
                        </div>
                    </td>
                </tr>
                    <td colspan="2">
                    <small v-if="!$v.amounts.roundup" class="text-danger"> Must round up to 100% </small></td>
          </table>
        </div>      
    </div>
</template>
<script>
import { required, numeric, minValue, between } from "vuelidate/lib/validators";
export default {
  name: "percentage",
  data() {
    return {
        amounts: [
          { id : 'amount1', value: 0},
          { id : 'amount2', value: 0},
          { id : 'amount3', value: 0},
          { id : 'amount4', value: 0},
      ]
    };
  },
  validations: {
      amounts: {
        required,
        $each: {
            value: {
                required,
                between: between(-100, 100) //number of characters
            }
        },
        roundup(){
            return this.getSum() == 100? true : false
        }
      }
  },
  methods:{
      getSum(){
        return this.amounts.reduce((a,b) => { return Number(b.value) == null? Number(a) : Number(a) + Number(b.value) }, 0)
      },
      validatePercentage(index){
          this.$v.amounts.$each[index].value.$touch()
          if(!this.$v.amounts.$error && this.getSum() == 100){
              this.$emit('percentageValidated', true);
          }
          else{
              this.$emit('percentageValidated', false)
          }
      }
  },
  computed: {
    remaining(){
        return 100 - this.getSum()
    },
  },
  
};
</script>
<style scoped>
.text-danger {
  color: red;
}
hr {
  color: lightgray;
  border: 0.5px solid lightgray;
  margin: 20px;
}
table{
    border: 0.5px solid lightgray;
    margin: 20px;
    padding: 10px;
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

.input select {
  border: 1px solid #ccc;
  font: inherit;
}

button {
  border: 1px solid #521751;
  background: #521751;
  color: white;
  padding: 6px;
  font: inherit;
  cursor: pointer;
}

button:hover,
button:active {
  background-color: #8d4288;
}

input {
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