<template>
    <froala id="edit" :tag="'textarea'" :config="config"></froala>
</template>

<script>
import { onMounted, ref, nextTick, defineComponent } from "vue";
import { Local } from '@/cache/index'


export default defineComponent({
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    setup(props,content) {
        const Editor = ref(null)
        const config = ref({
            editor: null,
            language: 'zh_cn',//语言
            height: 600,
            autofocus: true,
            toolbarSticky: true,
            // quickInsertEnabled: false,//便捷插入标签
            charCounterCount: false, //富文本的输入长度
            toolbarButtons: [
            "fullscreen", "bold", "italic", "underline", "strikeThrough", "subscript", "superscript",
            "|", "fontFamily", "fontSize", "color", "inlineClass", "inlineStyle", "paragraphStyle", "lineHeight", "|",
            "paragraphFormat", "align","formatOL","formatUL", "outdent", "indent", "quote", "-", "insertLink",
            "insertImage", "insertVideo", "embedly", "insertFile", "insertTable", "|", "emoticons",
            "specialCharacters", "insertHR", "selectAll", "clearFormatting", "|", "print", "spellChecker",
            "help", "html", "|", "undo", "redo"
            ], //自定义toolbarButtons，功能菜单
            fontFamily:{
                'myfont':'Myfont',
                'Arial,Helvetica,sans-serif': 'Arial',
                'Georgia,serif': 'Georgia',
                'Impact,Charcoal,sans-serif': 'Impact',
                'Tahoma,Geneva,sans-serif': 'Tahoma',
                "'Times New Roman',Times,serif": 'Times New Roman',
                'Verdana,Geneva,sans-serif': 'Verdana'
            },
            // imageEditButtons: [
            // 'imageReplace',
            // 'imageAlign',
            // 'imageCaption',
            // 'imageRemove',
            // ],//富文本对图片对操作
            imageDefaultWidth: 400,
            imageUploadParam: 'file', //上传图片的字段
            imageUploadURL:'https://localhost:3658/admin/editorUpload',//请求地址
            videoUploadURL: "https://localhost:3658/admin/editorUpload",
            fileUploadURL: "https://localhost:3658/admin/editorUpload",
            imageManagerLoadURL: "https://localhost:3658/admin/editorUpload",
            imageUploadMethod: 'POST',
            requestHeaders: {
                'Authorization': "Bearer " + Local.get('token')
            },
            // Allow to upload PNG and JPG.
            imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'jfif'],//接受图片的类型
            placeholderText: '请输入内容',
            // Set max file size to 20MB.
            fileMaxSize: 20 * 1024 * 1024, //限制图片大小
            toolbarSticky: false,
            // Allow to upload any file.
            events: {
                initialized: function () {
                    const editor = this
                    Editor.value = editor
                },
                'contentChanged': function () {
                    const editor = this
                    content.emit("on-change", editor.html.get(true));
                }
            }
        })

        const setHtml = (html) => {
            if(Editor.value) {
                Editor.value.html.set(html);
            }
        }

        return {
            config,
            Editor,
            setHtml
        }
    }
})
</script>

<style>
/*
    隐藏froala编辑器底部的logo
 */
.fr-box .fr-second-toolbar {
    display: none;
}
</style>
