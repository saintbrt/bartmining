const content = `<h2>Why Geological Mapping Comes First</h2>
<p>Before a drilling programme, before a geophysical survey, before any capital is committed to exploration, the geologist must build a mental and physical model of the terrane. Geological mapping translates the surface expression of the rock record into a spatial framework. identifying lithologies, contacts, faults, folds, alteration zones and structural trends that control mineralisation, in East and Southern Africa, where deeply weathered lateritic profiles often obscure bedrock, the mapper must integrate satellite data, stream sediment geochemistry and auger drilling results to reconstruct the sub-surface geology.</p>

<h2>Remote Sensing and Satellite Geology</h2>
<h3>Landsat and ASTER Imagery</h3>
<p>Landsat 8/9 OLI and ASTER multispectral imagery are the workhorses of regional geological mapping in Africa. Band ratio composites (e.g. Crosta technique for clay mineral detection, RGB composites for lithological discrimination) allow rapid mapping at 1:250,000 to 1:50,000 scale. ASTER thermal infrared bands distinguish silicate mineral groups that are otherwise undifferentiated in visible-NIR imagery. Both datasets are freely available from USGS EarthExplorer.</p>

<h3>SAR and DEM Analysis</h3>
<p>Synthetic aperture radar (SAR) from Sentinel-1 and SRTM/ALOS DEMs provide structural lineament mapping capability that is independent of cloud cover. critical for working in East Africa's humid highland zones where Landsat coverage is often cloud-obscured. Structural lineament extraction from DEM shaded relief and multi-illumination composites reveals fault networks, dyke swarms and fold hinges that are the primary targets for mineralisation.</p>

<h2>Field Geological Mapping</h2>
<h3>Regional Mapping (1:50,000 to 1:100,000)</h3>
<p>Regional mapping establishes the broad geological framework of a licence area: rock units, major structures, and the potential for mineralised horizons or intrusions to be present. Mapping traverses are spaced at 1–5 km intervals, with systematic rock sampling (one per lithological unit encountered) for geochemical context. Digital field capture via ArcGIS Collector, QField (QGIS) or Mappt accelerates data management and reduces transcription errors.</p>

<h3>Detailed Mapping (1:5,000 to 1:500)</h3>
<p>Detailed prospect-scale mapping defines the geometry of known mineralised zones. vein arrays, alteration envelopes, footwall/hanging-wall relationships, and provides the geological context for drill-hole targeting, at this scale, structural measurements (strike, dip, plunge, lineation) are collected systematically to constrain the 3D structural model.</p>

<h2>3D Geological Modelling</h2>
<p>Integrating surface mapping, drill-hole lithological logs, geophysical sections and geochemical data into a 3D geological model is the key step from which resource estimation flows. Seequent Leapfrog Geo's implicit modelling algorithms allow rapid construction and revision of 3D geological models as new data becomes available. Surfaces representing lithological contacts, alteration boundaries and structural discontinuities can be generated and updated iteratively, ensuring the model reflects the evolving geological understanding of the project.</p>

<h2>Geotechnical Characterisation</h2>
<p>Geotechnical characterisation of core. Rock Quality Designation (RQD), point load testing, fracture frequency logging, joint set measurement. provides the input data for pit slope stability analysis and underground excavation design, in tropical Africa, deep weathering profiles require special attention: the competence transition from saprolite to fresh rock is a critical design parameter for open-pit operations.</p>

<h2>Countries &amp; Regions We Cover</h2>
<div class="region-chips"><span class="region-chip">Tanzania</span><span class="region-chip">Kenya</span><span class="region-chip">Zambia</span><span class="region-chip">Zimbabwe</span><span class="region-chip">Mozambique</span><span class="region-chip">DRC</span><span class="region-chip">South Africa</span><span class="region-chip">Namibia</span><span class="region-chip">Botswana</span><span class="region-chip">Uganda</span><span class="region-chip">Rwanda</span><span class="region-chip">Ethiopia</span></div>`
export default content
