
<template>
   <v-content>
      <v-row justify="center">
        <v-col cols="8" md="3">
          <p class="subtitle-1">日付取得フィールドサンプル</p>
          <v-text-field v-model="value" outlined dense hide-details>
            <template v-slot:append-outer>
              <date-picker v-model="value" />
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="8" md="3">
          <p>日付： {{ value }}</p>
        </v-col>
        <v-col cols="8" md="3">
          <v-text-field v-model="value" outlined dense hide-details>
            <template v-slot:append-outer>
              <date-picker v-model="value" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-content>
  </template>

<script>



export default {
    name: 'BPIMain'
}
</script>


<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>