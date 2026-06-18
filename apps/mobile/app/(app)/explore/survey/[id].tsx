// Survey Camera — Sprint 11
// Captures photo + GPS at shutter moment, stores locally, queues for sync
import { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import * as ImageManipulator from 'expo-image-manipulator'
import * as SecureStore from 'expo-secure-store'
import { insertSurvey } from '../../../../lib/offline/local-db'
import { sync } from '../../../../lib/sync/sync-manager'

export default function SurveyScreen() {
  const { id: holeId } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [captured, setCaptured] = useState(false)

  if (!permission) return <View style={s.root} />
  if (!permission.granted) {
    return (
      <View style={s.root}>
        <Text style={s.msg}>Camera permission required</Text>
        <TouchableOpacity style={s.btn} onPress={requestPermission}><Text style={s.btnText}>Grant permission</Text></TouchableOpacity>
      </View>
    )
  }

  async function capture() {
    if (!cameraRef.current || submitting) return
    setSubmitting(true)
    try {
      // Capture GPS at shutter moment
      const [photo, loc] = await Promise.all([
        cameraRef.current.takePictureAsync({ quality: 1, base64: false }),
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      ])
      if (!photo) { Alert.alert('Camera error', 'Failed to capture photo'); setSubmitting(false); return }

      // Compress to quality 0.7 for 2G bandwidth
      const compressed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1280 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      )

      const teamId = await SecureStore.getItemAsync('team_id')
      await insertSurvey({
        hole_id: holeId,
        team_id: teamId ?? '',
        local_path: compressed.uri,
        photo_lat: loc.coords.latitude,
        photo_lng: loc.coords.longitude,
        accuracy_m: loc.coords.accuracy ?? undefined,
        notes: notes.trim() || undefined,
        submitted_at: new Date().toISOString(),
      })

      setCaptured(true)
      // Fire sync in background
      sync().catch(console.warn)
    } catch (e) {
      Alert.alert('Survey error', e instanceof Error ? e.message : String(e))
      setSubmitting(false)
    }
  }

  if (captured) {
    return (
      <View style={[s.root, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>✓</Text>
        <Text style={s.successTitle}>Survey submitted</Text>
        <Text style={s.successSub}>Photo queued for upload. Will sync automatically when connected.</Text>
        <TouchableOpacity style={[s.btn, { marginTop: 32 }]} onPress={() => router.back()}>
          <Text style={s.btnText}>Back to holes</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <CameraView ref={cameraRef} style={s.camera} facing={'back' as CameraType}>
        <View style={s.overlay}>
          {/* Crosshair */}
          <View style={s.crosshairH} />
          <View style={s.crosshairV} />
        </View>
      </CameraView>

      <View style={s.controls}>
        <TextInput
          style={s.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes (optional)"
          placeholderTextColor="#4A5568"
          multiline
          maxLength={200}
        />
        <TouchableOpacity style={s.shutterBtn} onPress={capture} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#0B0C0E" /> : <View style={s.shutterInner} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  crosshairH: { position: 'absolute', width: 40, height: 1, backgroundColor: 'rgba(200,151,59,0.7)' },
  crosshairV: { position: 'absolute', width: 1, height: 40, backgroundColor: 'rgba(200,151,59,0.7)' },
  controls: { padding: 20, backgroundColor: '#0B0C0E' },
  notesInput: { backgroundColor: '#16181C', borderRadius: 10, padding: 12, color: '#E8E9EC', fontSize: 14, borderWidth: 1, borderColor: '#2A2D35', marginBottom: 16 },
  shutterBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#C8973B', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#C8973B' },
  msg: { color: '#E8E9EC', textAlign: 'center', fontSize: 16, margin: 24 },
  btn: { backgroundColor: '#C8973B', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 24 },
  btnText: { color: '#0B0C0E', fontWeight: '700', fontSize: 15 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#10B981', textAlign: 'center', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#6B7A9A', textAlign: 'center' },
})
