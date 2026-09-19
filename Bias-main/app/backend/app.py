import os
from flask import Flask, jsonify, send_from_directory
from app.backend.database.db import init_db, create_database, db
from app.backend.config import Config
from app.backend.routes.observations import observations_bp
from app.backend.routes.map import map_bp
from app.backend.routes.species import species_bp
from app.backend.routes.crossings import crossings_bp
from app.backend.routes.analytics import analytics_bp

from app.data.pipelines.extract.seed import randseed
from app.data.pipelines.extract.inat_fetch import load_species
from app.data.pipelines.build import build_db

from app.backend.database.models import Crossings, Species

from app.data.pipelines.extract.crossings_fetch import load_california

from app.backend.utils.constants import *

'''
pkill -f flask
python -m app.backend.app
'''

# FRONTEND_DIR = '/workspaces/Bias/app/frontend'
FRONTEND_DIR = '/workspaces/Bias/app/frontend-react'

def create_app():
    app = Flask(__name__)
    print('CREATING')
    # Load config
    app.config.from_object(Config)

    # Initialize DB
    init_db(app)
    create_database(app)
   

    app.register_blueprint(observations_bp)
    app.register_blueprint(species_bp)
    app.register_blueprint(map_bp)
    app.register_blueprint(crossings_bp)
    app.register_blueprint(analytics_bp)
    return app

app = create_app()


@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(FRONTEND_DIR, 'assets'), 'favicon.ico')

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')



if __name__ == '__main__':

    # with app.app_context():
    #     spec = Species(
    #         common_name='Bird (General)',
    #         scientific_name=None,
    #         broad_taxon=BroadTaxons.BIRD.value,
    #         inat_taxon_id=None,
    #         count=0,
    #     )
    #     spec1 = Species(
    #         common_name='Mammal (General)',
    #         scientific_name=None,
    #         broad_taxon=BroadTaxons.MAMMAL.value,
    #         inat_taxon_id=None,
    #         count=0,
    #     )
    #     spec2 = Species(
    #         common_name='Reptile (General)',
    #         scientific_name=None,
    #         broad_taxon=BroadTaxons.REPTILE.value,
    #         inat_taxon_id=None,
    #         count=0,
    #     )
    #     spec3 = Species(
    #         common_name='Amphibian (General)',
    #         scientific_name=None,
    #         broad_taxon=BroadTaxons.AMPHIBIAN.value,
    #         inat_taxon_id=None,
    #         count=0,
    #     )
    #     db.session.add(spec)
    #     db.session.add(spec1)
    #     db.session.add(spec2)
    #     db.session.add(spec3)
    #     db.session.commit()
    #     Crossings.__table__.drop(db.engine, checkfirst=True)
    #     Crossings.__table__.create(db.engine)
    #     load_california()
      #  db.session.execute(db.text("DELETE FROM observations;"))
        # db.drop_all()
        # db.create_all()
        # load_species() 
        
     #  build_db()
    app.run(host='0.0.0.0', debug=True, port=5001)