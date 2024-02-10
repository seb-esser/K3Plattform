import streamlit as st
from folium import folium
from streamlit_folium import st_folium

st.header("[AKTEUR] Neues Angebot einsenden")

st.markdown("""
Hier kannst Du uns Daten übermitteln, die wir über die bekannten Channels ausspielen können. """)

st.warning("Diese Seite befindet sich noch im Aufbau. "
           "Eingegebene Daten werden derzeit noch nicht gespeichert oder weitergehend verarbeitet. ")

st.subheader("Basisdaten")

col1, col2 = st.columns(2)
with col1:
    st.text_input("Veranstalter")

    st.date_input("Startdatum")
    st.time_input("Startzeit")

    st.date_input("Enddatum")
    st.time_input("Endzeit")

with col2:
    st.warning("Location Picker ist noch nicht vollständig implementiert. ")
    m = folium.Map(location=[47.83970, 11.14411], zoom_start=16)
    # call to render Folium map in Streamlit
    st_data = st_folium(m, width=800)

st.date_input("Gewünschtes Publikationsdatum")
st.caption("Bitte beachte, dass wir für die Verarbeitung Deines Angebots bis zu 7 Tage benötigen. ")

with st.expander("Newsletter"):
    st.text_input("Deine Überschrift")

    st.text_area("Beschreibe Dein Angebot")

    st.file_uploader("Begleitende Dateien (z.B. Bilder, Videos, ...) ", accept_multiple_files=True)

    st.checkbox("Verteilung im Newsletter für Privatpersonen. ")
    st.checkbox(
        "Verteilung im Newsletter für öffentliche Einrichtungen (Schulen, Gemeinde- und Stadtverwaltungen, ...). ")

with st.expander("Instagram"):
    st.caption(
        "Bitte nummeriere die Bilder in ihrer Benennung, sodass klar wird, in welcher Reihenfolge wir sie veröffentlichen sollen")
    st.file_uploader("Bild-Dateien für Instagram und Facebook", accept_multiple_files=True)

    st.text_area("Caption Instagram")

    st.checkbox("Auch über Facebook ausspielen")

with st.expander("WhatsApp Channel"):
    st.caption(
        "Bitte nummeriere die Bilder in ihrer Benennung, sodass klar wird, in welcher Reihenfolge wir sie veröffentlichen sollen")
    st.file_uploader("Bild-Dateien für WhatsApp-Channel", accept_multiple_files=True)

    st.text_area("Caption WhatsApp-Channel")

st.button("Senden")
