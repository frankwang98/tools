<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { copy } from '@/utils/string'
import { ElMessage } from 'element-plus'
import { ref } from 'vue' // 确保这里导入了 ref
import mqtt from 'mqtt'

const publishTopic = ref('')
const publishMessage = ref('')
const subscribeTopic = ref('')
const receivedMessages = ref('')

let client: any = null

const info = reactive({
  title: "MQTT 示例",
  mqttClient: null as any,
})

// 连接 MQTT
const connectToBroker = (brokerUrl: string) => {
  client = mqtt.connect(brokerUrl)

  client.on('connect', () => {
    ElMessage({ message: '连接成功', type: 'success' })
  })

  client.on('error', (err: any) => {
    ElMessage.error(`连接失败: ${err}`)
  })

  client.on('message', (topic: string, message: Buffer) => {
    receivedMessages.value += `主题: ${topic}, 消息: ${message.toString()}\n`
  })
}

// 连接到 MQTT Broker
const string = 'ws://broker.hivemq.com:8000/mqtt'
connectToBroker(string)

const publishMessageToTopic = () => {
  if (client) {
    client.publish(publishTopic.value, publishMessage.value, (err: any) => {
      if (err) {
        ElMessage.error(`发布失败: ${err}`)
      } else {
        ElMessage.success(`已发布消息: ${publishMessage.value} 到 ${publishTopic.value}`)
        publishMessage.value = ''
      }
    })
  }
}

const subscribeToTopic = () => {
  if (client) {
    client.subscribe(subscribeTopic.value, (err: any) => {
      if (err) {
        ElMessage.error(`订阅失败: ${err}`)
      } else {
        ElMessage.success(`已订阅主题: ${subscribeTopic.value}`)
      }
    })
  }
}
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>
    
    <div class="p-4 rounded-2xl bg-white">
        <div>
            <el-input v-model="publishTopic" placeholder="发布主题" class="">
                <template #prepend>发布主题:</template>
            </el-input>
            <el-input v-model="publishMessage" placeholder="消息内容" class="">
                <template #prepend>消息内容:</template>
            </el-input>
            <div class="mt-3 mb-3">
                <el-button type="primary" @click="publishMessageToTopic">消息发布</el-button>
            </div>
        </div>

        <div>
            <el-input v-model="subscribeTopic" placeholder="订阅主题" class="">
                <template #prepend>订阅主题:</template>
            </el-input>
            <el-input type="textarea" v-model="receivedMessages" placeholder="接收到的消息" readonly></el-input>
        </div>
        <div class="mt-3">
            <el-button type="success" @click="subscribeToTopic">订阅</el-button>
        </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        MQTT发布订阅
      </el-text> 
    </ToolDetail>

  </div>
</template>

<style scoped>
</style>
