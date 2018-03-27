<template>
  <form @submit.prevent="validateBeforeSubmit">
    <div class="column is-12">
      <label class="label">Email</label>
      <p class="control has-icon has-icon-right">
        <input name="email" v-model="email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" type="text" placeholder="Email">
        <i v-show="errors.has('email')" class="fa fa-warning"></i>
        <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </p>
    </div>
  </form>

</template>
<script>
  export default {
    name: 'form-example',
    data: () => ({
      email: '',
      name: '',
      phone: '',
      url: ''
    }),
    methods: {
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // eslint-disable-next-line
            alert('Form Submitted!');
            return;
          }

          alert('Correct them errors!');
        });
      }
    }
  };


</script>
