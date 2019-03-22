<template>
    <div class="ErrorModalMessage">
        <div>
            <b-modal
                ref="errorModalMessage"
                visible="visible"
                hide-footer
                title="Error"
                errorMessage="errorMessage"
                size="lg"
            >
                <div class="d-block text-center">
                    {{errorMessage}}
                </div>
                <b-button class="mt-3" variant="primary" block @click="hideModal">Ok</b-button>
            </b-modal>
        </div>
    </div>
</template>


<script>
export default {
    name: "ErrorModalMessage",
    props: ["errorMessage", "visible"],
    methods: {
        hideModal() {
            // console.log('fechando tela erro');
            this.$refs.errorModalMessage.hide();
            this.$emit('onCloseErrorModalMessage');
        }
    }
}
</script>

<style scoped>

</style>
