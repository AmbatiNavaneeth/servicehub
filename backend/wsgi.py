import os
import sys
from pathlib import Path

# Add the backend directory to the Python path so `config` and `api` are importable
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
