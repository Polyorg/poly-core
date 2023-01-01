{{ define "metadata" }}
name: &name {{ .Values.app.name | quote }}
labels: {{ include "labels" . | indent 2 }}
namespace: {{ .Values.namespace }}
{{- end }}

{{ define "labels" }}
app: {{ .Values.app.name | quote }}
environment: {{ .Values.app.environment | quote }}
{{- end }}
