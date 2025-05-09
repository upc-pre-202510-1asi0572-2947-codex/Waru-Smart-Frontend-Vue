<script>
import {ForumApiService} from "../services/forum-api.service.js";
import {Question} from "../model/question.entity.js";
import UserQuestionList from "../components/user-question-list.component.vue";
import CommunityQuestionList from "../components/community-question-list.component.vue";
import QuestionItemCreateAndEditDialog from "../components/question-item-create-and-edit-dialog.component.vue";
import SowingItemCreateAndEditDialog from "../../crops/components/sowing-item-create-and-edit-dialog.component.vue";
import {CategoryApiService} from "../services/category-api.service.js";



export default {
  name: "forum-management",
  components: {SowingItemCreateAndEditDialog, QuestionItemCreateAndEditDialog, CommunityQuestionList, UserQuestionList},
  data() {
    return {
      questions: [],
      categories: [],
      profiles:[],
      question: {},
      selectedQuestion: {},
      filters: {},
      forumService: null,
      categoryService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    findIndexById(id) {
      return this.questions.findIndex((question) => question.id === id);
    },
    createQuestion() {
      this.question.date = new Date();
      this.question.authorId = 1;
      this.question = Question.fromDisplayableQuestion(this.question);
      console.log(this.question);
      this.forumService.createQuestion(this.question)
          .then((response) => {
            let buildItemData = this.buildItemData(response.data);
            this.question = Question.toDisplayableQuestion(buildItemData);
            this.questions.push(this.question);
          });
    },

    updateQuestion() {
       let questionUpdate = {
        categoryId: this.question.categoryId,
        questionText: this.question.ask
      };
      this.forumService
          .updateQuestion(this.question.id, questionUpdate)
          .then((response) => {
            let buildItemData = this.buildItemData(response.data);
            console.log(buildItemData);
            let index = this.findIndexById(buildItemData.questionId);
            console.log(index);
            this.questions.splice(index, 1, Question.toDisplayableQuestion(buildItemData));
          });
    },

    deleteQuestion() {
      console.log('Deleting question with ID:', this.question.id);

      this.forumService.deleteQuestion(this.question.id)
          .then(() => {
            this.questions = this.questions.filter((s) => s.id !== this.question.id);
            this.question = {};
          })
          .catch((error) => {
            console.error('Error deleting question:', error);
          });
    },

    onNewItemEventHandler() {
      this.question = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItemEventHandler(item) {
      this.question = item;
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItemEventHandler(item) {
      this.question = item;
      this.deleteQuestion();
    },

    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.question.ask.trim()) {
        if (item.id) {
          this.updateQuestion();
        } else {
          this.createQuestion();
        }
      }
      this.question = {};
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    confirmDeleteQuestion(item){
      this.$confirm.require({
        message:          `Are you sure you want to delete this Question?`,
        header:           'Delete Question',
        icon:             'pi pi-exclamation-triangle',
        rejectClass:      'button-cancel',
        rejectLabel:      'Cancel',
        acceptLabel:      'Delete',
        acceptClass:      'button-delete',
        accept:           () => this.onDeleteItemEventHandler(item),
        reject:           () => {}
      });
    },
    buildData() {
      console.log(this.questions);
      this.questions = this.questions.map((question) => {
        const category = this.categories.find((category) => category.categoryId === question.categoryId);
        const profile = this.profiles.find((profile) => profile.id === question.authorId);
        return {
          ...question,
          category: category?.name,
          userName: profile?.fullName
        };
      });
      console.log(this.questions);
    },
    buildItemData(data){
      const category = this.categories.find((category) => category.categoryId === data.categoryId);
      const profile = this.profiles.find((profile) => profile.id === data.authorId);

      data.category = category?.name;
      data.ask = data.questionText;
      data.userName = profile?.fullName;
      return data;
    },
    async getAllQuestions(){
      await this.forumService.getAllQuestions().then((response) =>{
        let questions = response.data;
        console.log(questions);
        this.questions = questions.map((question) => Question.toDisplayableQuestion(question));
      });
      return this.questions;
    },
    async getAllCategories(){
      await this.categoryService.getAllCategories().then((response) =>{
        this.categories = response.data;
      });
      return this.categories;
    },
    async getAllProfiles(){
      await this.forumService.getAllProfiles().then((response) =>{
        this.profiles = response.data;
        console.log(this.profiles);
      });
      return this.profiles;
    }
  },


  created() {
    this.forumService = new ForumApiService();
    this.categoryService = new CategoryApiService();
    Promise.all([this.getAllCategories(), this.getAllQuestions(), this.getAllProfiles()])
        .then(() => {
          this.buildData();
          console.log('Todas las categorías y preguntas se han cargado');
        })
        .catch((error) => {
          console.error('Error cargando categorías o preguntas:', error);
        });
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div>
    <h2 style="color:black;">{{$t('consultationForum')}}</h2>
    <pv-button class="pv-button button-brown" label="Ask your colleagues!" @click="onNewItemEventHandler" />
    <pv-tab-view>
      <pv-tab-panel header="Community">
        <community-question-list :data-source="questions"/>
      </pv-tab-panel>
      <pv-tab-panel header="My Questions">
        <user-question-list
            :data-source="questions"
            :on-edit-item-event-handler="onEditItemEventHandler"
            :confirm-delete-question="confirmDeleteQuestion"
        />
      </pv-tab-panel>

    </pv-tab-view>
  </div>

  <question-item-create-and-edit-dialog
      :entity="question"
      :visible="createAndEditDialogIsVisible"
      :categories="categories"
      entityName="Question"
      :edit="isEdit"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />
</template>


<style scoped>

</style>